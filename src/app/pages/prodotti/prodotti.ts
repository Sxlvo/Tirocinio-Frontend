import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api';

@Component({
  selector: 'app-prodotti',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prodotti.html',
  styleUrls: ['./prodotti.scss']
})
export class ProdottiComponent implements OnInit {
  tuttiProdotti: any[] = [];
  listaProdotti: any[] = [];
  loading = true;
  errore = '';
  agentCode = '';
  searchTerm = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.caricaProdotti();
  }

  caricaProdotti() {
    this.loading = true;
    this.errore = '';
    this.tuttiProdotti = [];
    this.listaProdotti = [];
    this.agentCode = localStorage.getItem('agentCode')?.trim() ?? '';
    // Il flag arriva dal login: true usa /prodotti, false usa /salespersonItemClusters filtrata per agente.
    const allItems = localStorage.getItem('allItems') === 'true';

    if (!this.agentCode) {
      this.loading = false;
      this.errore = 'Codice agente non trovato';
      this.cdr.detectChanges();
      return;
    }

    this.api.getProdottiVisibili(this.agentCode, allItems).subscribe({
      next: (res: any) => {
        this.tuttiProdotti = (res.value ?? []).map((prodotto: any) =>
          this.normalizzaProdottoAgente(prodotto),
        );
        this.applicaRicerca();
        this.loading = false;

        // FIX: forza aggiornamento UI
        this.cdr.detectChanges();
      },
      error: (e) => {
        this.loading = false;
        this.errore = 'Errore nel caricamento prodotti';
        console.error(e);

        // anche qui, per sicurezza
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
      this.listaProdotti = this.tuttiProdotti;
      return;
    }

    this.listaProdotti = this.tuttiProdotti.filter((prodotto) => {
      const testo = [
        prodotto?.codiceArticolo,
        prodotto?.itemNo,
        prodotto?.descrizione,
        prodotto?.description,
        prodotto?.clusterCode,
        prodotto?.unitaMisura,
      ]
        .map((value) => this.normalizzaTesto(value))
        .join(' ');

      return testo.includes(query);
    });
  }

  private normalizzaTesto(value: any): string {
    return String(value ?? '').trim().toLowerCase();
  }

  private normalizzaProdottoAgente(prodotto: any): any {
    return {
      ...prodotto,
      id:
        prodotto.systemId ??
        prodotto.id ??
        `${prodotto.salesPersonCode ?? ''}-${prodotto.itemNo ?? prodotto.codiceArticolo ?? ''}-${prodotto.clusterCode ?? ''}`,
      codiceArticolo: prodotto.codiceArticolo ?? prodotto.itemNo ?? '',
      descrizione: prodotto.descrizione ?? prodotto.description ?? '',
      prezzoUnitario: Number(prodotto.prezzoUnitario ?? prodotto.unitPrice ?? 0),
      unitaMisura: prodotto.unitaMisura ?? prodotto.unitOfMeasure ?? '',
    };
  }
}
