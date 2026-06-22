import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../api';

@Component({
  selector: 'app-clienti',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clienti.html',
  styleUrls: ['./clienti.scss']
})
export class ClientiComponent implements OnInit {
  tuttiClienti: any[] = [];
  listaClienti: any[] = [];
  loading = true;
  errore = '';
  searchTerm = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.caricaClienti();
  }

  caricaClienti() {
    this.loading = true;
    this.errore = '';
    this.tuttiClienti = [];
    this.listaClienti = [];

    this.api.getClienti().subscribe({
      next: (res: any) => {
        this.tuttiClienti = res.value ?? [];
        this.applicaRicerca();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        this.loading = false;
        this.errore = 'Errore nel caricamento clienti';
        console.error(e);
        this.cdr.detectChanges();
      }
    });
  }

  aggiornaRicerca(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applicaRicerca();
    this.cdr.detectChanges();
  }

  private applicaRicerca(): void {
    const query = this.normalizzaTesto(this.searchTerm);

    if (!query) {
      this.listaClienti = this.tuttiClienti;
      return;
    }

    this.listaClienti = this.tuttiClienti.filter((cliente) => {
      const testo = [
        cliente?.codiceCliente,
        cliente?.nome,
        cliente?.email,
        cliente?.indirizzo,
        cliente?.citta,
        cliente?.city,
      ]
        .map((value) => this.normalizzaTesto(value))
        .join(' ');

      return testo.includes(query);
    });
  }

  private normalizzaTesto(value: any): string {
    return String(value ?? '').trim().toLowerCase();
  }

  nuovoOrdine(cliente: any): void {
    sessionStorage.setItem('selectedCustomerForOrder', JSON.stringify(cliente));
    void this.router.navigate(['/ordini/nuovo']);
  }

  nuovoCliente(): void {
    void this.router.navigate(['/clienti/nuovo']);
  }
}
