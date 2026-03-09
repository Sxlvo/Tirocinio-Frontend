import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  errore = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.errore = '';

    if (!this.email || !this.password) {
      this.errore = 'Compila tutti i campi';
      return;
    }

    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: (ok) => {
        this.loading = false;

        if (ok) {
          this.router.navigate(['/']);
        } else {
          this.errore = 'Credenziali non valide';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errore = 'Errore durante il login';
        console.error(err);
      }
    });
  }
}