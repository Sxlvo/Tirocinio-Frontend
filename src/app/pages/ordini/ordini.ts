import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { ApiService } from '../../api';

type VistaOrdini = 'tutti' | 'giorno' | 'da-evadere' | 'in-consegna';

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
  vista: VistaOrdini = 'tutti';
  titolo = 'Ordini';
  sottotitolo = 'Elenco degli ordini associati all agente loggato';

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

  private parseVista(vista: string | null): VistaOrdini {
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
    if (this.vista === 'giorno') {
      this.listaOrdini = this.tuttiOrdini.filter((ordine) => this.isOrdineDelGiorno(ordine));
      return;
    }

    if (this.vista === 'da-evadere') {
      this.listaOrdini = this.tuttiOrdini.filter((ordine) => this.isOrdineDaEvadere(ordine));
      return;
    }

    if (this.vista === 'in-consegna') {
      this.listaOrdini = this.tuttiOrdini.filter((ordine) => this.isOrdineInConsegna(ordine));
      return;
    }

    this.listaOrdini = this.tuttiOrdini;
  }

  private isOrdineDelGiorno(ordine: any): boolean {
    if (!ordine?.dataDocumento) {
      return false;
    }

    const dataDocumento = new Date(ordine.dataDocumento);
    const oggi = new Date();

    return (
      dataDocumento.getFullYear() === oggi.getFullYear() &&
      dataDocumento.getMonth() === oggi.getMonth() &&
      dataDocumento.getDate() === oggi.getDate()
    );
  }

  private isOrdineDaEvadere(ordine: any): boolean {
    const stato = String(ordine?.stato ?? '').trim().toLowerCase();
    return stato === 'open' || stato === 'aperto';
  }

  private isOrdineInConsegna(ordine: any): boolean {
    const dataConsegna = this.getDataConsegnaOrdine(ordine);

    if (dataConsegna && this.isDataFutura(dataConsegna)) {
      return true;
    }

    return this.righeOrdine.some((riga) => {
      if (String(riga?.numeroOrdine ?? '').trim() !== String(ordine?.numeroOrdine ?? '').trim()) {
        return false;
      }

      const dataConsegnaRiga = this.getDataConsegnaOrdine(riga);
      return !!dataConsegnaRiga && this.isDataFutura(dataConsegnaRiga);
    });
  }

  private isDataFutura(data: Date): boolean {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    data.setHours(0, 0, 0, 0);
    return data >= oggi;
  }

  getDataConsegnaVisualizzata(ordine: any): Date | null {
    const dataTestata = this.getDataConsegnaOrdine(ordine);

    if (dataTestata) {
      return dataTestata;
    }

    for (const riga of this.righeOrdine) {
      if (String(riga?.numeroOrdine ?? '').trim() !== String(ordine?.numeroOrdine ?? '').trim()) {
        continue;
      }

      const dataRiga = this.getDataConsegnaOrdine(riga);

      if (dataRiga) {
        return dataRiga;
      }
    }

    return null;
  }

  private getDataConsegnaOrdine(ordine: any): Date | null {
    const value =
      ordine?.dataConsegnaPianificata ??
      ordine?.plannedDeliveryDate ??
      ordine?.dataConsegna ??
      ordine?.requestedDeliveryDate ??
      ordine?.promisedDeliveryDate ??
      ordine?.shipmentDate ??
      null;

    if (!value) {
      return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || date.getFullYear() <= 1) {
      return null;
    }

    return date;
  }
}
