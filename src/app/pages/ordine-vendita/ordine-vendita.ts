import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../api';

type RigaOrdineForm = {
  productId: string;
  quantity: number;
};

@Component({
  selector: 'app-ordine-vendita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ordine-vendita.html',
  styleUrl: './ordine-vendita.scss',
})
export class OrdineVenditaComponent implements OnInit {
  cliente: any = null;

  loading = true;
  saving = false;
  errore = '';
  successo = '';

  indirizziSpedizione: any[] = [];
  indirizzoSelezionatoId = '';

  mostraSceltaIndirizzo = false;
  formPronto = false;

  prodotti: any[] = [];
  righeListinoVendita: any[] = [];

  righeOrdine: RigaOrdineForm[] = [
    {
      productId: '',
      quantity: 1,
    },
  ];

  numeroOrdineCreato = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const raw = sessionStorage.getItem('selectedCustomerForOrder');

    if (!raw) {
      this.errore = 'Nessun cliente selezionato';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      this.cliente = JSON.parse(raw);
    } catch (e: any) {
      console.error(e);
      this.errore = 'Errore nella lettura del cliente selezionato';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    forkJoin({
      indirizzi: this.api.getIndirizziSpedizione(this.cliente.codiceCliente),
      prodotti: this.api.getProdotti(),
      righeListino: this.api.getRigheListinoVendita(this.cliente.codiceCliente),
    }).subscribe({
      next: ({ indirizzi, prodotti, righeListino }) => {
        console.log('PRODOTTI DA BUSINESS CENTRAL:', prodotti?.value);

        this.indirizziSpedizione = indirizzi?.value ?? [];
        this.righeListinoVendita = righeListino?.value ?? [];

        const prodottiBase = prodotti?.value ?? [];

        this.prodotti = prodottiBase.map((prodotto: any) => {
          const prezzoListino = this.trovaPrezzoPerCliente(
            prodotto.codiceArticolo,
            this.cliente.codiceCliente,
            this.righeListinoVendita,
          );

          const unitaMisura =
            prodotto.unitaMisura ??
            prodotto.baseUnitOfMeasure ??
            prodotto.unitOfMeasureCode ??
            prodotto.unitOfMeasure ??
            prodotto.baseUnitOfMeasureCode ??
            prodotto.unitaMisuraBase ??
            '';

          return {
            ...prodotto,
            prezzoBase: Number(prodotto.prezzoUnitario ?? 0),
            prezzoUnitario: prezzoListino ?? Number(prodotto.prezzoUnitario ?? 0),
            unitaMisura,
          };
        });

        if (this.indirizziSpedizione.length > 1) {
          this.mostraSceltaIndirizzo = true;
          this.formPronto = false;
        } else if (this.indirizziSpedizione.length === 1) {
          this.indirizzoSelezionatoId = this.indirizziSpedizione[0].id;
          this.mostraSceltaIndirizzo = false;
          this.formPronto = true;
        } else {
          this.mostraSceltaIndirizzo = false;
          this.formPronto = true;
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e: any) => {
        console.error(e);
        this.errore = 'Errore nel caricamento dati ordine';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private trovaPrezzoPerCliente(
    codiceArticolo: string,
    codiceCliente: string,
    righeListino: any[],
  ): number | null {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);

    const righeValide = righeListino.filter((riga) => {
      const itemNo = String(riga.itemNo ?? '').trim();
      const sourceNo = String(riga.sourceNo ?? '').trim();

      if (itemNo !== String(codiceArticolo).trim()) {
        return false;
      }

      if (sourceNo && sourceNo !== String(codiceCliente).trim()) {
        return false;
      }

      if (riga.startingDate) {
        const dataInizio = new Date(riga.startingDate);
        dataInizio.setHours(0, 0, 0, 0);

        if (dataInizio > oggi) {
          return false;
        }
      }

      if (riga.endingDate) {
        const dataFine = new Date(riga.endingDate);
        dataFine.setHours(0, 0, 0, 0);

        if (dataFine < oggi) {
          return false;
        }
      }

      return true;
    });

    const prezzoCliente = righeValide.find(
      (riga) => String(riga.sourceNo ?? '').trim() === String(codiceCliente).trim(),
    );

    if (prezzoCliente) {
      return Number(prezzoCliente.unitPrice ?? 0);
    }

    const prezzoGenerale = righeValide.find((riga) => String(riga.sourceNo ?? '').trim() === '');

    if (prezzoGenerale) {
      return Number(prezzoGenerale.unitPrice ?? 0);
    }

    return null;
  }

  confermaIndirizzo(): void {
    if (!this.indirizzoSelezionatoId) {
      this.errore = 'Seleziona un indirizzo di spedizione';
      this.cdr.detectChanges();
      return;
    }

    this.errore = '';
    this.formPronto = true;
    this.mostraSceltaIndirizzo = false;
    this.cdr.detectChanges();
  }

  get indirizzoSelezionato(): any | null {
    if (!this.indirizzoSelezionatoId) {
      return null;
    }

    return (
      this.indirizziSpedizione.find((x) => String(x.id) === String(this.indirizzoSelezionatoId)) ??
      null
    );
  }

  getProdottoById(productId: string): any | null {
    if (!productId) {
      return null;
    }

    return this.prodotti.find((p) => String(p.id) === String(productId)) ?? null;
  }

  getPrezzoUnitarioRiga(riga: RigaOrdineForm): number {
    const prodotto = this.getProdottoById(riga.productId);

    return Number(prodotto?.prezzoUnitario ?? 0);
  }

  getUnitaMisuraRiga(riga: RigaOrdineForm): string {
    const prodotto = this.getProdottoById(riga.productId);

    return String(prodotto?.unitaMisura ?? '').trim();
  }

  getTotaleRiga(riga: RigaOrdineForm): number {
    const prezzoUnitario = this.getPrezzoUnitarioRiga(riga);
    const quantita = Number(riga.quantity ?? 0);

    return prezzoUnitario * quantita;
  }

  getTotaleOrdine(): number {
    return this.righeOrdine.reduce((totale, riga) => {
      return totale + this.getTotaleRiga(riga);
    }, 0);
  }

  aggiungiRiga(): void {
    this.righeOrdine.push({
      productId: '',
      quantity: 1,
    });

    this.cdr.detectChanges();
  }

  rimuoviRiga(index: number): void {
    if (this.righeOrdine.length === 1) {
      return;
    }

    this.righeOrdine.splice(index, 1);
    this.cdr.detectChanges();
  }

  private compattaRighe(): RigaOrdineForm[] {
    const mappa = new Map<string, number>();

    for (const riga of this.righeOrdine) {
      const productId = String(riga.productId ?? '').trim();
      const quantity = Number(riga.quantity ?? 0);

      if (!productId || quantity <= 0) {
        continue;
      }

      const quantitaAttuale = mappa.get(productId) ?? 0;
      mappa.set(productId, quantitaAttuale + quantity);
    }

    return Array.from(mappa.entries()).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
  }

  private validaRighe(): string {
    if (!this.righeOrdine.length) {
      return 'Inserisci almeno una riga ordine';
    }

    for (let i = 0; i < this.righeOrdine.length; i++) {
      const riga = this.righeOrdine[i];

      if (!riga.productId) {
        return `Seleziona un prodotto nella riga ${i + 1}`;
      }

      if (!riga.quantity || riga.quantity <= 0) {
        return `Inserisci una quantità valida nella riga ${i + 1}`;
      }

      const prodotto = this.getProdottoById(riga.productId);

      if (!prodotto?.codiceArticolo) {
        return `Prodotto non valido nella riga ${i + 1}`;
      }
    }

    return '';
  }

  private creaPayloadOrdine(): any {
    const shipping = this.indirizzoSelezionato;
    const salespersonCode = (localStorage.getItem('agentCode') ?? '').trim();

    const ordinePayload: any = {
      numeroCliente: this.cliente.codiceCliente,
      salespersonCode,
    };

    if (shipping?.code) {
      ordinePayload.shipToCode = shipping.code;
    }

    if (!shipping) {
      ordinePayload.shipToName = this.cliente.nome ?? '';
      ordinePayload.shipToAddress = this.cliente.indirizzo ?? '';
    } else {
      ordinePayload.shipToName = shipping.name ?? '';
      ordinePayload.shipToAddress = shipping.address ?? '';
      ordinePayload.shipToCity = shipping.city ?? '';
      ordinePayload.shipToPostCode = shipping.postCode ?? '';
    }

    return ordinePayload;
  }

  private creaRigaPayload(numeroOrdine: string, riga: RigaOrdineForm): any {
    const prodotto = this.getProdottoById(riga.productId);

    return {
      numeroOrdine,
      codiceArticolo: prodotto.codiceArticolo,
      quantita: riga.quantity,
      prezzoUnitario: this.getPrezzoUnitarioRiga(riga),
      unitaMisura: this.getUnitaMisuraRiga(riga),
    };
  }

  private creaRigheOrdineSequenziali(
    numeroOrdine: string,
    righeCompattate: RigaOrdineForm[],
    index = 0,
  ): void {
    if (index >= righeCompattate.length) {
      this.saving = false;
      this.numeroOrdineCreato = numeroOrdine;
      this.successo = `Ordine ${numeroOrdine} creato correttamente`;
      this.cdr.detectChanges();
      return;
    }

    const payload = this.creaRigaPayload(numeroOrdine, righeCompattate[index]);

    this.api.createRigaOrdine(payload).subscribe({
      next: () => {
        this.creaRigheOrdineSequenziali(numeroOrdine, righeCompattate, index + 1);
      },
      error: (e: any) => {
        console.error(e);
        this.saving = false;
        this.errore = `Testata ordine creata, ma errore nella creazione della riga ${index + 1}`;
        this.cdr.detectChanges();
      },
    });
  }

  creaOrdine(): void {
    this.errore = '';
    this.successo = '';

    if (!this.cliente?.codiceCliente) {
      this.errore = 'Cliente non valido';
      this.cdr.detectChanges();
      return;
    }

    const erroreRighe = this.validaRighe();

    if (erroreRighe) {
      this.errore = erroreRighe;
      this.cdr.detectChanges();
      return;
    }

    const righeCompattate = this.compattaRighe();

    if (!righeCompattate.length) {
      this.errore = 'Inserisci almeno una riga ordine valida';
      this.cdr.detectChanges();
      return;
    }

    const ordinePayload = this.creaPayloadOrdine();

    this.saving = true;
    this.cdr.detectChanges();

    this.api.createOrdine(ordinePayload).subscribe({
      next: (ordineRes: any) => {
        const numeroOrdine = ordineRes?.numeroOrdine;

        if (!numeroOrdine) {
          this.saving = false;
          this.errore = 'Ordine creato ma numero ordine non restituito dalla API';
          this.cdr.detectChanges();
          return;
        }

        this.creaRigheOrdineSequenziali(numeroOrdine, righeCompattate, 0);
      },
      error: (e: any) => {
        console.error(e);
        this.saving = false;
        this.errore = 'Errore nella creazione dell’ordine';
        this.cdr.detectChanges();
      },
    });
  }

  tornaAiClienti(): void {
    void this.router.navigate(['/clienti']);
  }

  vaiAOrdini(): void {
    void this.router.navigate(['/ordini']);
  }
}
