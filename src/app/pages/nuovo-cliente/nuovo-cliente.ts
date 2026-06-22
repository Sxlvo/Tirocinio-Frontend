import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../api';

type IndirizzoSpedizioneForm = {
  code: string;
  name: string;
  address: string;
  city: string;
  postCode: string;
  county: string;
  countryRegionCode: string;
};

@Component({
  selector: 'app-nuovo-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuovo-cliente.html',
  styleUrl: './nuovo-cliente.scss',
})
export class NuovoClienteComponent implements OnInit {
  codiceCliente = '';
  nome = '';
  indirizzo = '';
  indirizzo2 = '';
  citta = '';
  cap = '';
  codicePaese = '';
  telefono = '';
  email = '';
  partitaIva = '';
  codiceAgente = localStorage.getItem('agentCode')?.trim() ?? '';
  modelliCliente: any[] = [];
  codiceModelloCliente = '';
  loadingModelli = true;
  saving = false;
  errore = '';
  successo = '';
  indirizziSpedizione: IndirizzoSpedizioneForm[] = [];

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.api.getCustomerTemplates().subscribe({
      next: (res: any) => {
        this.modelliCliente = res?.value ?? [];
        if (this.modelliCliente.length === 1) {
          this.codiceModelloCliente = String(this.modelliCliente[0]?.code ?? '').trim();
        }
        this.loadingModelli = false;
        this.cdr.detectChanges();
      },
      error: (e: any) => {
        console.error('Errore caricamento modelli cliente:', e);
        this.loadingModelli = false;
        this.errore =
          e?.error?.error?.message ??
          e?.error?.message ??
          'Errore nel caricamento dei modelli cliente';
        this.cdr.detectChanges();
      },
    });
  }

  salvaCliente(): void {
    this.errore = '';
    this.successo = '';

    if (!this.nome.trim()) {
      this.errore = 'Inserisci il nome del cliente';
      return;
    }

    if (!this.codiceModelloCliente) {
      this.errore = 'Seleziona un modello cliente';
      return;
    }

    const erroreIndirizzi = this.validaIndirizziSpedizione();
    if (erroreIndirizzi) {
      this.errore = erroreIndirizzi;
      return;
    }

    const payload: any = {
      nome: this.nome.trim(),
      indirizzo: this.indirizzo.trim(),
      indirizzo2: this.indirizzo2.trim(),
      citta: this.citta.trim(),
      cap: this.cap.trim(),
      codicePaese: this.codicePaese.trim(),
      telefono: this.telefono.trim(),
      email: this.email.trim(),
      partitaIva: this.partitaIva.trim(),
      salespersonCode: this.codiceAgente,
      customerTemplateCode: this.codiceModelloCliente,
    };

    if (this.codiceCliente.trim()) {
      payload.codiceCliente = this.codiceCliente.trim();
    }

    this.saving = true;
    this.api.createCliente(payload).subscribe({
      next: (cliente: any) => {
        const codiceClienteCreato = String(cliente?.codiceCliente ?? this.codiceCliente).trim();

        if (!codiceClienteCreato) {
          this.saving = false;
          this.errore = 'Cliente creato, ma codice cliente non restituito dalla API';
          this.cdr.detectChanges();
          return;
        }

        this.creaIndirizziSpedizioneSequenziali(codiceClienteCreato);
      },
      error: (e: any) => {
        console.error('Errore creazione cliente:', e);
        this.saving = false;
        this.errore =
          e?.error?.error?.message ??
          e?.error?.message ??
          'Errore durante la creazione del cliente';
        this.cdr.detectChanges();
      },
    });
  }

  aggiungiIndirizzoSpedizione(): void {
    this.indirizziSpedizione.push({
      code: '',
      name: this.nome.trim(),
      address: '',
      city: '',
      postCode: '',
      county: '',
      countryRegionCode: this.codicePaese.trim(),
    });
  }

  rimuoviIndirizzoSpedizione(index: number): void {
    this.indirizziSpedizione.splice(index, 1);
  }

  private validaIndirizziSpedizione(): string {
    for (let i = 0; i < this.indirizziSpedizione.length; i++) {
      const indirizzo = this.indirizziSpedizione[i];

      if (!indirizzo.code.trim()) {
        return `Inserisci il codice per l'indirizzo di spedizione ${i + 1}`;
      }

      if (!indirizzo.address.trim()) {
        return `Inserisci l'indirizzo di spedizione ${i + 1}`;
      }
    }

    return '';
  }

  private creaIndirizziSpedizioneSequenziali(codiceCliente: string, index = 0): void {
    if (index >= this.indirizziSpedizione.length) {
      this.saving = false;
      this.successo = `Cliente ${codiceCliente} creato correttamente`;
      this.cdr.detectChanges();
      return;
    }

    const indirizzo = this.indirizziSpedizione[index];
    const payload = {
      customerNo: codiceCliente,
      code: indirizzo.code.trim(),
      name: indirizzo.name.trim() || this.nome.trim(),
      address: indirizzo.address.trim(),
      city: indirizzo.city.trim(),
      postCode: indirizzo.postCode.trim(),
      county: indirizzo.county.trim(),
      countryRegionCode: indirizzo.countryRegionCode.trim(),
    };

    this.api.createIndirizzoSpedizione(payload).subscribe({
      next: () => this.creaIndirizziSpedizioneSequenziali(codiceCliente, index + 1),
      error: (e: any) => {
        console.error('Errore creazione indirizzo spedizione:', e);
        this.saving = false;
        this.errore =
          e?.error?.error?.message ??
          e?.error?.message ??
          `Cliente creato, ma errore nell'indirizzo di spedizione ${index + 1}`;
        this.cdr.detectChanges();
      },
    });
  }

  tornaAiClienti(): void {
    void this.router.navigate(['/clienti']);
  }
}
