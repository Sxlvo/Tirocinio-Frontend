import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { ApiService } from '../../api';
import {
  OrderView,
  filterOrders,
  getDisplayedDeliveryDate,
  getOrderStatus,
} from '../../domain/order-utils';

@Component({
  selector: 'app-ordini',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordini.html',
  styleUrl: './ordini.scss',
})
export class OrdiniComponent implements OnInit {
  tuttiOrdini: any[] = [];
  righeOrdine: any[] = [];
  listaOrdini: any[] = [];
  loading = false;
  errore = '';
  userName = '';
  agentCode = '';
  vista: OrderView = 'tutti';
  titolo = 'Ordini';
  sottotitolo = 'Elenco degli ordini associati all agente loggato';
  searchTerm = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') ?? '';
    this.agentCode = localStorage.getItem('agentCode') ?? '';

    this.route.paramMap.subscribe((params) => {
      this.vista = this.parseVista(params.get('vista'));
      this.aggiornaTestiVista();

      if (this.tuttiOrdini.length > 0) {
        this.applicaFiltroVista();
        this.cdr.detectChanges();
        return;
      }

      this.caricaOrdini();
    });
  }

  caricaOrdini(): void {
    this.loading = true;
    this.errore = '';
    this.tuttiOrdini = [];
    this.righeOrdine = [];
    this.listaOrdini = [];
    this.cdr.detectChanges();

    const agentCode = localStorage.getItem('agentCode')?.trim();

    if (!agentCode) {
      this.errore = 'Codice agente non trovato';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    forkJoin({
      ordini: this.api.getOrdiniByAgente(agentCode),
      righe: this.api.getRigheOrdine(),
    })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: ({ ordini, righe }) => {
          this.tuttiOrdini = ordini?.value ?? [];
          this.righeOrdine = righe?.value ?? [];
          this.applicaFiltroVista();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Errore caricamento ordini:', err);
          this.errore = 'Errore nel caricamento ordini';
          this.cdr.detectChanges();
        },
      });
  }

  nuovoOrdine(): void {
    sessionStorage.removeItem('selectedCustomerForOrder');
    void this.router.navigate(['/ordini/seleziona-cliente']);
  }

  apriOrdine(ordine: any): void {
    const numeroOrdine = String(ordine?.numeroOrdine ?? '').trim();

    if (!numeroOrdine) {
      return;
    }

    void this.router.navigate(['/ordini/dettaglio', numeroOrdine]);
  }

  mostraColonnaStato(): boolean {
    return this.vista === 'tutti';
  }

  getStatoVisualizzato(ordine: any): string {
    return getOrderStatus(ordine) || '-';
  }

  aggiornaRicerca(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applicaFiltroVista();
    this.cdr.detectChanges();
  }

  private parseVista(vista: string | null): OrderView {
    if (vista === 'giorno' || vista === 'da-evadere' || vista === 'in-consegna') {
      return vista;
    }

    return 'tutti';
  }

  private aggiornaTestiVista(): void {
    if (this.vista === 'giorno') {
      this.titolo = 'Ordini del giorno';
      this.sottotitolo = 'Ordini con data documento di oggi';
      return;
    }

    if (this.vista === 'da-evadere') {
      this.titolo = 'Ordini da evadere';
      this.sottotitolo = 'Ordini aperti ancora da preparare';
      return;
    }

    if (this.vista === 'in-consegna') {
      this.titolo = 'Ordini in consegna';
      this.sottotitolo = 'Ordini con data consegna successiva a oggi';
      return;
    }

    this.titolo = 'Ordini';
    this.sottotitolo = 'Elenco degli ordini associati all agente loggato';
  }

  private applicaFiltroVista(): void {
    this.listaOrdini = filterOrders(
      this.tuttiOrdini,
      this.righeOrdine,
      this.vista,
      this.searchTerm,
    );
  }

  getDataConsegnaVisualizzata(ordine: any): Date | null {
    return getDisplayedDeliveryDate(ordine, this.righeOrdine);
  }
}
