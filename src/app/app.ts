import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/login']);
    window.location.assign(window.location.origin);
  }
}
