import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl =
    'https://api.businesscentral.dynamics.com/v2.0/6b99dd4b-9681-4414-8a12-1beeb67853f9/Sandbox_BC27/api/bs/tirocinio/v1.0/companies(14fae42a-0299-f011-a7b1-6045bdc8dcac)/';

  private token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlFaZ045SHFOa0dORU00R2VLY3pEMDJQY1Z2NCIsImtpZCI6IlFaZ045SHFOa0dORU00R2VLY3pEMDJQY1Z2NCJ9.eyJhdWQiOiJodHRwczovL2FwaS5idXNpbmVzc2NlbnRyYWwuZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNmI5OWRkNGItOTY4MS00NDE0LThhMTItMWJlZWI2Nzg1M2Y5LyIsImlhdCI6MTc3NDI4MTk2MywibmJmIjoxNzc0MjgxOTYzLCJleHAiOjE3NzQyODc0MjYsImFjciI6IjEiLCJhaW8iOiJBWFFBaS84YkFBQUErTVo2L1kzV3hGeXBNTUhvc2RxNWtzNHdXMTYyY0ZTUEVaSnNaS3BSZEQrSlZUR3NmK1R1bjRkWUUrN0dPeGhaSy8rcjVGYzNZOHc0U0R2dDNNYVlwTWU0ZDlGemF4Z3ZmRFdodFNNZFZDc0NmVExJd3huRjRJWkJ6QjRYSzFXbnpFWEsrcHhYR29TelFNOGppNXYxcmc9PSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiJlMjY1ODFiNy1iOGZkLTQ1Y2YtODYxMC1iODc1NzBkMWM0ZDkiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IjAxIiwiZ2l2ZW5fbmFtZSI6IlN0YWdlIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMmEwMTplMTE6MzAxMDo0ODMwOjNjNGQ6MTc0MDoyZGU0OmUzMDYiLCJuYW1lIjoiU3RhZ2UwMSIsIm9pZCI6IjEyMzBjMzM2LWUyZDQtNGRmMS1iNjFlLWNmNzEyOTllMGU5ZCIsInB1aWQiOiIxMDAzMjAwMjEwQUI1Rjg2IiwicmgiOiIxLkFYTUFTOTJaYTRHV0ZFU0tFaHZ1dG5oVC1UM3ZiWmxzczFOQmhnZW1fVHdCdUo4QUFPTnpBQS4iLCJzY3AiOiJGaW5hbmNpYWxzLlJlYWRXcml0ZS5BbGwgdXNlcl9pbXBlcnNvbmF0aW9uIiwic2lkIjoiMDAyZTFjY2EtMDRjYy05YTdlLTdiMDctY2RmZDEzMWViY2Q0Iiwic3ViIjoiUDRqZjJaT0RpNUs1X3J4LVJIc0pPMEo4b243bUJYX0ZGd04wR3p0Qm1UWSIsInRpZCI6IjZiOTlkZDRiLTk2ODEtNDQxNC04YTEyLTFiZWViNjc4NTNmOSIsInVuaXF1ZV9uYW1lIjoiU3RhZ2UwMUBic3NybC5pdCIsInVwbiI6IlN0YWdlMDFAYnNzcmwuaXQiLCJ1dGkiOiJnNXV2MEYzYXFFeWtqMEdXUVBjQ0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2FjdF9mY3QiOiI5IDMiLCJ4bXNfZnRkIjoid0Z1TDgzQWU0S3BNZFkwQnlPdTkxb2VqMEhvWW5XdnJaLWJseTJxWUNxd0JabkpoYm1ObFl5MWtjMjF6IiwieG1zX2lkcmVsIjoiMSAzMCIsInhtc19zdWJfZmN0IjoiMyA4In0.XFiRfx3ksuO57ETCpuwuJefspzipOP2cS7ETD4vmWSVw0LytnX-hW55KFXWpJK9ZZmYIOrm9TmQXR5YvJ3Pm8NXB1ZwnSCcw4RypwV1pWmPPaAe83HVIJOYocMz7b3S3GzIx8LxLuBLap6LxISVqQU2COUMMP9lFk_wD3rtpECp9GvyeMmc2t_g-CN-GjDC1bMEZNnkxkcPjRPvZKiFP4UCYZloWSD5Gwv-cqo5iUiXh6IhuWZqSackpsdF842A_oQuhNFQjjXORO7_2xwzps7Fuw4ChzJy8W5Bdarq_y6eSTyG4LU4ORiFWAbFvXaeqskpvgFmgBhNh9PmRp8LPMQ';
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  getProdotti() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(`${this.baseUrl}prodotti`, { headers });
  }
  getClienti() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(`${this.baseUrl}clienti`, { headers });
  }
  getOrdini() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get(`${this.baseUrl}ordini`, { headers });
  }
  getOrdiniByAgente(agentCode: string): Observable<any> {
  const safeCode = agentCode.trim().replace(/'/g, "''");
  const url = `${this.baseUrl}ordini?$filter=salespersonCode eq '${safeCode}'`;

  return this.http.get<any>(url, {
    headers: this.getHeaders(),
  });
}
}
