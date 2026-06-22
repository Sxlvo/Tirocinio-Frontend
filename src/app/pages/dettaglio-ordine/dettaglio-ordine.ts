import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../api';

@Component({
  selector: 'app-dettaglio-ordine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dettaglio-ordine.html',
  styleUrl: './dettaglio-ordine.scss',
})
export class DettaglioOrdineComponent implements OnInit {
  ordine: any = null;
  righeOrdine: any[] = [];
  loading = true;
  errore = '';
  shipping = false;
  azioneErrore = '';
  azioneSuccesso = '';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const numeroOrdine = this.route.snapshot.paramMap.get('numeroOrdine')?.trim() ?? '';
    const agentCode = localStorage.getItem('agentCode')?.trim() ?? '';

    if (!numeroOrdine || !agentCode) {
      this.errore = 'Ordine o codice agente non valido';
      this.loading = false;
      return;
    }

    this.caricaDettaglio(numeroOrdine, agentCode);
  }

  private caricaDettaglio(numeroOrdine: string, agentCode: string, dopoSpedizione = false): void {
    forkJoin({
      ordini: this.api.getOrdiniByAgente(agentCode),
      righe: this.api.getRigheOrdine(),
    }).subscribe({
      next: ({ ordini, righe }) => {
        this.ordine =
          (ordini?.value ?? []).find(
            (ordine: any) => String(ordine?.numeroOrdine ?? '').trim() === numeroOrdine,
          ) ?? null;

        this.righeOrdine = (righe?.value ?? []).filter(
          (riga: any) => String(riga?.numeroOrdine ?? '').trim() === numeroOrdine,
        );

        if (!this.ordine) {
          this.errore = 'Ordine non trovato';
        }

        if (dopoSpedizione) {
          this.azioneSuccesso = `Spedizione dell'ordine ${numeroOrdine} registrata correttamente`;
        }

        this.loading = false;
        this.shipping = false;
        this.cdr.detectChanges();
      },
      error: (e: any) => {
        console.error('Errore caricamento dettaglio ordine:', e);
        if (dopoSpedizione) {
          this.azioneSuccesso = `Spedizione dell'ordine ${numeroOrdine} registrata correttamente`;
          this.azioneErrore = 'La spedizione è stata registrata, ma non è stato possibile aggiornare i dati';
        } else {
          this.errore = 'Errore nel caricamento del dettaglio ordine';
        }
        this.loading = false;
        this.shipping = false;
        this.cdr.detectChanges();
      },
    });
  }

  get totaleOrdine(): number {
    return Number(this.ordine?.totaleOrdine ?? this.ordine?.totale ?? 0);
  }

  get statoOrdine(): string {
    return String(this.ordine?.stato ?? this.ordine?.status ?? '-');
  }

  get datiSpedizioneDisponibili(): boolean {
    return this.righeOrdine.some((riga) => riga?.quantitaDaSpedire !== undefined);
  }

  get ordineCompletamenteSpedito(): boolean {
    return (
      this.datiSpedizioneDisponibili &&
      this.righeOrdine.length > 0 &&
      this.righeOrdine.every((riga) => Number(riga?.quantitaDaSpedire ?? 0) <= 0)
    );
  }

  get puoSpedire(): boolean {
    const stato = this.statoOrdine.trim().toLowerCase();
    return (
      !!this.ordine?.id &&
      !!this.ordine?.numeroOrdine &&
      this.righeOrdine.length > 0 &&
      !this.ordineCompletamenteSpedito &&
      (stato === 'open' || stato === 'aperto' || stato === 'released' || stato === 'rilasciato')
    );
  }

  spedisciOrdine(): void {
    if (!this.puoSpedire || this.shipping) {
      return;
    }

    const numeroOrdine = String(this.ordine.numeroOrdine).trim();
    const confermato = window.confirm(
      `Confermi la registrazione della spedizione per l'ordine ${numeroOrdine}?`,
    );

    if (!confermato) {
      return;
    }

    this.azioneErrore = '';
    this.azioneSuccesso = '';
    this.shipping = true;

    this.api.spedisciOrdine(String(this.ordine.id), numeroOrdine).subscribe({
      next: () => {
        const agentCode = localStorage.getItem('agentCode')?.trim() ?? '';
        this.caricaDettaglio(numeroOrdine, agentCode, true);
      },
      error: (e: any) => {
        console.error('Errore spedizione ordine:', e);
        this.shipping = false;
        this.azioneErrore =
          e?.error?.error?.message ??
          e?.error?.message ??
          `Errore durante la spedizione dell'ordine ${numeroOrdine}`;
        this.cdr.detectChanges();
      },
    });
  }

  tornaAgliOrdini(): void {
    void this.router.navigate(['/ordini']);
  }
}
