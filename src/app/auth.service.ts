import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthenticationResult, AccountInfo, RedirectRequest, SilentRequest } from '@azure/msal-browser';
import { msalInstance, BC_SCOPES } from './auth-config';

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
  private baseUrl =
    'https://api.businesscentral.dynamics.com/v2.0/6b99dd4b-9681-4414-8a12-1beeb67853f9/Sandbox_BC27/ODataV4/Company(Id=14fae42a-0299-f011-a7b1-6045bdc8dcac)/AgentLoginWS';

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
    return result.accessToken;
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

    let lastError: any = null;

    for (const originalEmail of emails) {
      const email = originalEmail.trim();
      if (!email) continue;

      const safeEmail = email.replace(/'/g, "''");
      const normalizedEmail = safeEmail.toLowerCase();

      const candidateUrls = [
        `${this.baseUrl}?$filter=tolower(E_Mail) eq '${normalizedEmail}'`,
        `${this.baseUrl}?$filter=E_Mail eq '${safeEmail}'`,
      ];

      console.log('[AuthService] Ricerca agente BC con email:', email);

      for (const url of candidateUrls) {
        try {
          const res = await firstValueFrom(this.http.get<any>(url, { headers }));
          console.log('[AuthService] Risposta OData BC:', res);

          const agent = res?.value?.[0];
          if (agent?.Code) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('accessToken', token);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', String(agent.Name ?? email).trim());
            localStorage.setItem('agentCode', String(agent.Code).trim());
            console.log('[AuthService] Login riuscito — Agente:', agent.Code);
            return { ok: true };
          }
        } catch (e: any) {
          lastError = e;
          console.error(
            '[AuthService] Errore OData BC per email',
            email,
            ':',
            e?.status,
            e?.statusText,
            e?.error,
          );
        }
      }
    }

    if (lastError?.status && lastError.status !== 404) {
      return this.fail(
        'BC_REQUEST_FAILED',
        `Errore durante la verifica dell'agente su Business Central (${lastError.status}).`
      );
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

  getPostLoginRedirect(): string {
    const target = sessionStorage.getItem('post_login_redirect') || '/home';
    sessionStorage.removeItem('post_login_redirect');
    return target;
  }

  async getToken(): Promise<string> {
    await this.initMsal();

    const account = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0] ?? null;
    if (!account) {
      throw new Error('Nessun account Microsoft disponibile. Effettua di nuovo il login.');
    }

    msalInstance.setActiveAccount(account);

    try {
      const result = await msalInstance.acquireTokenSilent({
        scopes: BC_SCOPES,
        account,
      });
      localStorage.setItem('accessToken', result.accessToken);
      return result.accessToken;
    } catch (silentError) {
      console.error('[AuthService] acquireTokenSilent fallito:', silentError);
      this.logout();
      throw new Error('Impossibile rinnovare il token Microsoft. Effettua di nuovo il login.');
    }
  }

  async ensureSession(): Promise<boolean> {
    const token = localStorage.getItem('accessToken');
    if (!token || localStorage.getItem('isLoggedIn') !== 'true') return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (Date.now() >= payload.exp * 1000) {
        await this.getToken();
      }
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  logout(): void {
    ['isLoggedIn', 'accessToken', 'userEmail', 'userName', 'agentCode'].forEach((k) =>
      localStorage.removeItem(k)
    );

    sessionStorage.removeItem('post_login_redirect');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getUserName(): string {
    return localStorage.getItem('userName') || '';
  }
}