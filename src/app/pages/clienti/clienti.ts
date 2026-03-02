import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api';

@Component({
  selector: 'app-clienti',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clienti.html',
  styleUrls: ['./clienti.scss']
})
export class ClientiComponent implements OnInit {
  listaClienti: any[] = [];
  loading = true;
  errore = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.caricaClienti();
  }

  caricaClienti() {
    this.loading = true;
    this.errore = '';
    this.listaClienti = [];

    this.api.getClienti().subscribe({
      next: (res: any) => {
        this.listaClienti = res.value ?? [];
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
}