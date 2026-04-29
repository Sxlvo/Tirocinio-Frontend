import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, map, Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl =
    'https://api.businesscentral.dynamics.com/v2.0/6b99dd4b-9681-4414-8a12-1beeb67853f9/Sandbox_BC27/api/bs/tirocinio/v1.0/companies(14fae42a-0299-f011-a7b1-6045bdc8dcac)/';

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
      switchMap((headers) => this.http.get<any>(`${this.baseUrl}prodotti`, { headers })),
    );
  }

  getClienti(): Observable<any> {
    return this.getHeaders$().pipe(
      switchMap((headers) => this.http.get<any>(`${this.baseUrl}clienti`, { headers })),
    );
  }

  getOrdini(): Observable<any> {
    return this.getHeaders$().pipe(
      switchMap((headers) => this.http.get<any>(`${this.baseUrl}ordini`, { headers })),
    );
  }

  getOrdiniByAgente(agentCode: string): Observable<any> {
    const safeCode = agentCode.trim().replace(/'/g, "''");
    const url = `${this.baseUrl}ordini?$filter=salespersonCode eq '${safeCode}'`;

    return this.getHeaders$().pipe(
      switchMap((headers) => this.http.get<any>(url, { headers })),
    );
  }

  getIndirizziSpedizione(customerNo: string): Observable<any> {
    const safeCustomerNo = customerNo.trim().replace(/'/g, "''");
    const url = `${this.baseUrl}indirizziSpedizione?$filter=customerNo eq '${safeCustomerNo}'`;

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
  getClientiByAgente(agentCode: string): Observable<any> {
  const safeCode = agentCode.trim().replace(/'/g, "''");
  const url = `${this.baseUrl}clienti?$filter=salespersonCode eq '${safeCode}'`;

  return this.getHeaders$().pipe(
    switchMap((headers) => this.http.get<any>(url, { headers })),
  );
}
}
