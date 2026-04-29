import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements OnInit {
  errore = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit(): Promise<void> {
    const hasAuthResponse =
      window.location.hash.includes('code=') ||
      window.location.hash.includes('error=') ||
      window.location.search.includes('code=') ||
      window.location.search.includes('error=');

    if (hasAuthResponse) {
      this.loading = true;

      try {
        // Timeout di sicurezza: se MSAL si blocca oltre 15 secondi, mostra errore
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout: il server Microsoft non ha risposto in tempo.')), 15000)
        );

        const result = await Promise.race([
          this.auth.completeMicrosoftRedirect(),
          timeoutPromise,
        ]);

        if (!result) {
          this.loading = false;
          return;
        }

        if (!result.ok) {
          this.errore = result.message;
          this.loading = false;
          return;
        }

        const redirect = this.auth.getPostLoginRedirect();
        await this.router.navigateByUrl(redirect || '/home');
      } catch (e: any) {
        console.error('[LoginComponent] Errore durante il completamento del redirect:', e);
        this.errore = e?.message || 'Errore imprevisto durante il login. Riprova.';
        this.loading = false;
      }
      return;
    }

    const ok = await this.auth.ensureSession();
    if (ok) {
      const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/home';
      await this.router.navigateByUrl(redirect);
      return;
    }

    this.loading = false;
  }

  async loginMicrosoft(): Promise<void> {
    this.errore = '';
    this.loading = true;

    try {
      const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/home';
      await this.auth.startMicrosoftLogin(redirect);
    } catch (error: any) {
      console.error('Errore durante il login Microsoft:', error);
      this.errore = 'Errore durante il login: ' + (error?.message ?? error);
      this.loading = false;
    }
  }
}