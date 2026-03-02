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
  listaProdotti: any[] = [];
  loading = true;
  errore = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.caricaProdotti();
  }

  caricaProdotti() {
    this.loading = true;
    this.errore = '';
    this.listaProdotti = [];

    this.api.getProdotti().subscribe({
      next: (res: any) => {
        this.listaProdotti = res.value ?? [];
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
}