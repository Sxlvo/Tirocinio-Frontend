import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../api';

@Component({
  selector: 'app-seleziona-cliente-ordine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seleziona-cliente-ordine.html',
  styleUrl: './seleziona-cliente-ordine.scss',
})
export class SelezionaClienteOrdineComponent implements OnInit {
  listaClienti: any[] = [];
  loading = true;
  errore = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.caricaClienti();
  }

  caricaClienti(): void {
    this.loading = true;
    this.errore = '';
    this.listaClienti = [];

    this.api.getClienti().subscribe({
      next: (res: any) => {
        this.listaClienti = res?.value ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
        this.errore = 'Errore nel caricamento clienti';
        this.cdr.detectChanges();
      },
    });
  }

  selezionaCliente(cliente: any): void {
    sessionStorage.setItem('selectedCustomerForOrder', JSON.stringify(cliente));
    void this.router.navigate(['/ordini/nuovo']);
  }

  tornaAgliOrdini(): void {
    void this.router.navigate(['/ordini']);
  }
}
