import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { msalInstance } from '../../auth-config';

@Component({
  selector: 'app-auth-entry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-entry.html',
  styleUrl: './auth-entry.scss',
})
export class AuthEntryComponent implements OnInit {
  popupMode = false;
  errore = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const hasOAuthParams = typeof window !== 'undefined' && (
      window.location.search.includes('code=') ||
      window.location.search.includes('error=') ||
      window.location.hash.includes('code=') ||
      window.location.hash.includes('error=')
    );

    this.popupMode = !!window.opener;

    // Caso 1: callback dentro popup di MSAL.
    // Qui bisogna consumare la risposta OAuth, altrimenti il parent resta bloccato su "Accesso in corso...".
    if (this.popupMode && hasOAuthParams) {
      try {
        await msalInstance.initialize();
        await msalInstance.handleRedirectPromise();
      } catch (error) {
        console.error('[AuthEntry] Errore callback popup MSAL:', error);
      } finally {
        window.close();
      }
      return;
    }

    // Caso 2: popup aperto ma senza parametri OAuth utili.
    if (this.popupMode) {
      window.close();
      return;
    }

    // Caso 3: apertura normale dell'app.
    const ok = await this.auth.ensureSession();
    await this.router.navigateByUrl(ok ? '/home' : '/login');
  }
}
