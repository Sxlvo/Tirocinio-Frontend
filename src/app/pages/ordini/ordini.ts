import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ApiService } from '../../api';

@Component({
  selector: 'app-ordini',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordini.html',
  styleUrl: './ordini.scss',
})
export class OrdiniComponent implements OnInit {
  listaOrdini: any[] = [];
  loading = false;
  errore = '';
  userName = '';
  agentCode = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') ?? '';
    this.agentCode = localStorage.getItem('agentCode') ?? '';
    this.caricaOrdini();
  }

  caricaOrdini(): void {
    this.loading = true;
    this.errore = '';
    this.listaOrdini = [];
    this.cdr.detectChanges();

    const agentCode = localStorage.getItem('agentCode')?.trim();

    if (!agentCode) {
      this.errore = 'Codice agente non trovato';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.api
      .getOrdiniByAgente(agentCode)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.listaOrdini = res?.value ?? [];

          if (this.listaOrdini.length === 0) {
            this.errore = 'Nessun ordine associato a questo agente';
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Errore caricamento ordini:', err);
          this.errore = 'Errore nel caricamento ordini';
          this.cdr.detectChanges();
        },
      });
  }
}
