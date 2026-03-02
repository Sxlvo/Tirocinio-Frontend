import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api';

@Component({
  selector: 'app-ordini',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordini.html',
  styleUrls: ['./ordini.scss']
})
export class OrdiniComponent implements OnInit {
  listaOrdini: any[] = [];
  loading = true;
  errore = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.caricaOrdini();
  }

  caricaOrdini() {
    this.loading = true;
    this.errore = '';
    this.listaOrdini = [];

    this.api.getOrdini().subscribe({
      next: (res: any) => {
        this.listaOrdini = res.value ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        this.loading = false;
        this.errore = 'Errore nel caricamento ordini';
        console.error(e);
        this.cdr.detectChanges();
      }
    });
  }
}