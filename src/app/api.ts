import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, map, Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.businessCentral.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  private getHeaders$(): Observable<HttpHeaders> {
    return from(this.auth.getToken()).pipe(
      map(
        (token) =>
          new HttpHeaders({
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }),
      ),
    );
  }

  getProdotti(): Observable<any> {
    return this.getHeaders$().pipe(
      switchMap((headers) =>
        this.http.get<any>(`${this.baseUrl}prodotti`, { headers }),
      ),
    );
  }

  getProdottiByAgente(agentCode: string): Observable<any> {
    const safeCode = agentCode.trim().replace(/'/g, "''");
    const url = `${this.baseUrl}salespersonItemClusters?$filter=salesPersonCode eq '${safeCode}'`;

    return this.getHeaders$().pipe(
      switchMap((headers) => this.http.get<any>(url, { headers })),
    );
  }

  getProdottiVisibili(agentCode: string, allItems: boolean): Observable<any> {
    // All Items attivo: l'agente vede l'intero catalogo Business Central.
    // All Items spento: l'agente vede solo le righe assegnate in Salesperson Item Cluster.
    return allItems ? this.getProdotti() : this.getProdottiByAgente(agentCode);
  }

  getClienti(): Observable<any> {
    return this.getHeaders$().pipe(
      switchMap((headers) =>
        this.http.get<any>(`${this.baseUrl}clienti`, { headers }),
      ),
    );
  }

  getClientiByAgente(agentCode: string): Observable<any> {
    const safeCode = agentCode.trim().replace(/'/g, "''");
    const url = `${this.baseUrl}clienti?$filter=salespersonCode eq '${safeCode}'`;

    return this.getHeaders$().pipe(
      switchMap((headers) => this.http.get<any>(url, { headers })),
    );
  }

  createCliente(payload: any): Observable<any> {
    return this.getHeaders$().pipe(
      switchMap((headers) =>
        this.http.post<any>(`${this.baseUrl}clienti`, payload, { headers }),
      ),
    );
  }

  getCustomerTemplates(): Observable<any> {
    return this.getHeaders$().pipe(
      switchMap((headers) =>
        this.http.get<any>(`${this.baseUrl}customerTemplates`, { headers }),
      ),
    );
  }

  getOrdini(): Observable<any> {
    return this.getHeaders$().pipe(
      switchMap((headers) =>
        this.http.get<any>(`${this.baseUrl}ordini`, { headers }),
      ),
    );
  }

  getOrdiniByAgente(agentCode: string): Observable<any> {
    const safeCode = agentCode.trim().replace(/'/g, "''");
    const url = `${this.baseUrl}ordini?$filter=salespersonCode eq '${safeCode}'`;

    return this.getHeaders$().pipe(
      switchMap((headers) => this.http.get<any>(url, { headers })),
    );
  }

  getRigheOrdine(): Observable<any> {
    return this.getHeaders$().pipe(
      switchMap((headers) =>
        this.http.get<any>(`${this.baseUrl}righeOrdine`, { headers }),
      ),
    );
  }

  getIndirizziSpedizione(customerNo: string): Observable<any> {
    const safeCustomerNo = customerNo.trim().replace(/'/g, "''");
    const url = `${this.baseUrl}indirizziSpedizione?$filter=customerNo eq '${safeCustomerNo}'`;

    return this.getHeaders$().pipe(
      switchMap((headers) => this.http.get<any>(url, { headers })),
    );
  }

  createIndirizzoSpedizione(payload: any): Observable<any> {
    return this.getHeaders$().pipe(
      switchMap((headers) =>
        this.http.post<any>(`${this.baseUrl}indirizziSpedizione`, payload, { headers }),
      ),
    );
  }

  getRigheListinoVendita(customerNo: string): Observable<any> {
  const safeCustomerNo = customerNo.trim().replace(/'/g, "''");

  const filter = `sourceNo eq '${safeCustomerNo}' or sourceNo eq ''`;
  const url = `${this.baseUrl}righeListinoVendita?$filter=${encodeURIComponent(filter)}`;

  return this.getHeaders$().pipe(
    switchMap((headers) => this.http.get<any>(url, { headers })),
  );
}

  createOrdine(payload: any): Observable<any> {
    return this.getHeaders$().pipe(
      switchMap((headers) =>
        this.http.post<any>(`${this.baseUrl}ordini`, payload, { headers }),
      ),
    );
  }

  createRigaOrdine(payload: any): Observable<any> {
    return this.getHeaders$().pipe(
      switchMap((headers) =>
        this.http.post<any>(`${this.baseUrl}righeOrdine`, payload, { headers }),
      ),
    );
  }

  spedisciOrdine(orderId: string, numeroOrdine: string): Observable<any> {
    const safeId = encodeURIComponent(orderId.trim());
    const url = `${this.baseUrl}ordini(${safeId})/Microsoft.NAV.PostSalesShipment`;

    return this.getHeaders$().pipe(
      switchMap((headers) =>
        this.http.post<any>(
          url,
          { salesOrderNumber: numeroOrdine.trim() },
          { headers },
        ),
      ),
    );
  }
}
