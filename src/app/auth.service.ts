import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthenticationResult, AccountInfo, RedirectRequest, SilentRequest } from '@azure/msal-browser';
import { msalInstance, BC_SCOPES, MSAL_CONFIG } from './auth-config';
import { environment } from '../environments/environment';
import { AgentLogin, findAgentByEmails } from './domain/agent-login';

export type LoginErrorCode =
  | 'REDIRECT_FAILED'
  | 'ACCESS_TOKEN_MISSING'
  | 'EMAIL_NOT_FOUND'
  | 'AGENT_NOT_FOUND'
  | 'BC_REQUEST_FAILED'
  | 'TOKEN_REFRESH_FAILED'
  | 'UNKNOWN_ERROR';

export type LoginResult =
  | { ok: true }
  | { ok: false; code: LoginErrorCode; message: string };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenStorageKey = 'bcAccessToken';

  private readonly agentLoginUrl = `${environment.businessCentral.apiBaseUrl}agentLogins`;

  private initPromise?: Promise<void>;

  constructor(private http: HttpClient) {}

  private fail(code: LoginErrorCode, message: string): LoginResult {
    return { ok: false, code, message };
  }

  private async initMsal(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = msalInstance.initialize();
    }
    await this.initPromise;
  }

  private clearAppSession(): void {
    ['isLoggedIn', 'accessToken', 'userEmail', 'userName', 'agentCode', 'allItems'].forEach((k) =>
      localStorage.removeItem(k)
    );

    sessionStorage.removeItem('post_login_redirect');
    sessionStorage.removeItem(this.tokenStorageKey);
  }

  private clearMsalStorage(): void {
    const clientId = MSAL_CONFIG.auth.clientId.toLowerCase();

    for (const storage of [localStorage, sessionStorage]) {
      const keysToRemove: string[] = [];

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        const normalizedKey = key?.toLowerCase() ?? '';

        if (normalizedKey.includes('msal') || normalizedKey.includes(clientId)) {
          keysToRemove.push(key as string);
        }
      }

      keysToRemove.forEach((key) => storage.removeItem(key));
    }
  }

  async startMicrosoftLogin(redirectAfterLogin?: string): Promise<void> {
    await this.initMsal();

    const target = redirectAfterLogin && redirectAfterLogin !== '/login' ? redirectAfterLogin : '/home';
    sessionStorage.setItem('post_login_redirect', target);

    const request: RedirectRequest = {
      scopes: BC_SCOPES,
      prompt: 'select_account',
    };

    await msalInstance.loginRedirect(request);
  }

  async completeMicrosoftRedirect(): Promise<LoginResult | null> {
    await this.initMsal();

    let authResult: AuthenticationResult | null = null;
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout MSAL: handleRedirectPromise non ha risposto.')), 12000)
      );
      authResult = await Promise.race([
        msalInstance.handleRedirectPromise(),
        timeoutPromise,
      ]);
    } catch (e: any) {
      console.error('[AuthService] handleRedirectPromise fallito:', e);
      return this.fail(
        'REDIRECT_FAILED',
        e?.errorMessage || e?.message || 'Errore durante il completamento del login Microsoft.'
      );
    }

    if (!authResult) {
      return null;
    }

    if (authResult.account) {
      msalInstance.setActiveAccount(authResult.account);
    }

    const account = authResult.account ?? msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0] ?? null;
    if (!account) {
      return this.fail('ACCESS_TOKEN_MISSING', 'Login Microsoft completato, ma nessun account è disponibile.');
    }

    let token = authResult.accessToken;
    if (!token) {
      try {
        token = await this.acquireBusinessCentralToken(account);
      } catch (e: any) {
        console.error('[AuthService] Token BC non ottenuto dopo redirect:', e);
        return this.fail(
          'ACCESS_TOKEN_MISSING',
          e?.message || 'Login Microsoft riuscito, ma non è stato restituito un access token per Business Central.'
        );
      }
    }

    const emails = this.extractEmailsFromAuthResult(authResult, account);
    console.log('[AuthService] Email candidate da account/idToken:', emails);

    return this.loadProfile(token, emails);
  }

  private async acquireBusinessCentralToken(account: AccountInfo): Promise<string> {
    const request: SilentRequest = {
      scopes: BC_SCOPES,
      account,
    };

    const result = await msalInstance.acquireTokenSilent(request);
    sessionStorage.setItem(this.tokenStorageKey, result.accessToken);
    return result.accessToken;
  }

  private getStoredToken(): string | null {
    return sessionStorage.getItem(this.tokenStorageKey) || localStorage.getItem('accessToken');
  }

  private isTokenUsable(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  }

  private async loadProfile(token: string, emails: string[]): Promise<LoginResult> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    if (emails.length === 0) {
      console.error('[AuthService] Nessuna email trovata in account/idTokenClaims.');
      return this.fail(
        'EMAIL_NOT_FOUND',
        'Login Microsoft riuscito, ma il token non contiene un indirizzo email o username utilizzabile.'
      );
    }

    let response: { value?: AgentLogin[] };
    try {
      response = await firstValueFrom(this.http.get<{ value?: AgentLogin[] }>(this.agentLoginUrl, { headers }));
    } catch (error: any) {
      console.error('[AuthService] Errore API agentLogins:', error);
      return this.fail(
        'BC_REQUEST_FAILED',
        `Errore durante la verifica dell'agente su Business Central (${error?.status ?? 'API non disponibile'}).`
      );
    }

    const agent = findAgentByEmails(response?.value ?? [], emails);
    if (agent) {
      this.saveAgentSession(token, agent.email || emails[0], agent);
      return { ok: true };
    }

    return this.fail(
      'AGENT_NOT_FOUND',
      `Utente autenticato, ma nessun agente Business Central corrisponde alle email trovate: ${emails.join(', ')}`
    );
  }

  private extractEmailsFromAuthResult(authResult: AuthenticationResult, account?: AccountInfo | null): string[] {
    const claims: any = authResult.idTokenClaims ?? {};
    const resolvedAccount: AccountInfo | null = account ?? authResult.account ?? msalInstance.getActiveAccount() ?? null;

    const candidates = [
      resolvedAccount?.username,
      claims.preferred_username,
      claims.upn,
      claims.email,
      claims.unique_name,
      claims.login_hint,
    ];

    return Array.from(
      new Set(
        candidates
          .filter((value): value is string => typeof value === 'string')
          .map((value) => value.trim())
          .filter(Boolean)
      )
    );
  }

  private saveAgentSession(token: string, email: string, agent: AgentLogin): void {
    localStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem(this.tokenStorageKey, token);
    localStorage.removeItem('accessToken');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', String(agent.name ?? email).trim());
    localStorage.setItem('agentCode', String(agent.code).trim());
    // Salviamo il flag dell'agente per decidere se caricare tutto il catalogo o solo gli articoli assegnati.
    localStorage.setItem(
      'allItems',
      this.isTruthy(agent.allItems) ? 'true' : 'false',
    );
    console.log('[AuthService] Login riuscito — Agente:', agent.code);
  }

  getPostLoginRedirect(): string {
    const target = sessionStorage.getItem('post_login_redirect') || '/home';
    sessionStorage.removeItem('post_login_redirect');
    return target;
  }

  async getToken(): Promise<string> {
    await this.initMsal();

    const account = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0] ?? null;
    if (!account) {
      const storedToken = this.getStoredToken();
      if (storedToken && this.isTokenUsable(storedToken)) {
        sessionStorage.setItem(this.tokenStorageKey, storedToken);
        localStorage.removeItem('accessToken');
        return storedToken;
      }

      throw new Error('Nessun account Microsoft disponibile. Effettua di nuovo il login.');
    }

    msalInstance.setActiveAccount(account);

    try {
      const result = await msalInstance.acquireTokenSilent({
        scopes: BC_SCOPES,
        account,
      });
      sessionStorage.setItem(this.tokenStorageKey, result.accessToken);
      return result.accessToken;
    } catch (silentError) {
      console.error('[AuthService] acquireTokenSilent fallito:', silentError);
      const storedToken = this.getStoredToken();
      if (storedToken && this.isTokenUsable(storedToken)) {
        sessionStorage.setItem(this.tokenStorageKey, storedToken);
        localStorage.removeItem('accessToken');
        return storedToken;
      }

      this.clearAppSession();
      throw new Error('Impossibile rinnovare il token Microsoft. Effettua di nuovo il login.');
    }
  }

  async ensureSession(): Promise<boolean> {
    if (localStorage.getItem('isLoggedIn') !== 'true') return false;

    try {
      await this.getToken();
      return true;
    } catch {
      this.clearAppSession();
      return false;
    }
  }

  async logout(): Promise<void> {
    this.clearAppSession();

    try {
      await this.initMsal();
      const account = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0] ?? null;
      await msalInstance.clearCache({ account });
      msalInstance.setActiveAccount(null);
    } catch (e) {
      console.warn('[AuthService] Pulizia cache MSAL fallita, pulisco lo storage manualmente:', e);
    } finally {
      this.clearMsalStorage();
    }
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getUserName(): string {
    return localStorage.getItem('userName') || '';
  }

  private isTruthy(value: any): boolean {
    return value === true || String(value ?? '').trim().toLowerCase() === 'true';
  }
}
