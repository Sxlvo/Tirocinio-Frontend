import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  // 1. INCOLLA QUI L'URL DELLE TUE API (fermati a /v1.0/companies(tuo-id)/ )
  private baseUrl = 'https://api.businesscentral.dynamics.com/v2.0/6b99dd4b-9681-4414-8a12-1beeb67853f9/Sandbox/api/bs/tirocinio/v1.0/companies(fca3511e-7a01-f111-a1f9-7ced8d268eae)/';
  
  // 2. INCOLLA QUI IL TOKEN DI POSTMAN
  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InNNMV95QXhWOEdWNHlOLUI2ajJ4em1pazVBbyIsImtpZCI6InNNMV95QXhWOEdWNHlOLUI2ajJ4em1pazVBbyJ9.eyJhdWQiOiJodHRwczovL2FwaS5idXNpbmVzc2NlbnRyYWwuZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNmI5OWRkNGItOTY4MS00NDE0LThhMTItMWJlZWI2Nzg1M2Y5LyIsImlhdCI6MTc3MjQ2NjUyOSwibmJmIjoxNzcyNDY2NTI5LCJleHAiOjE3NzI0NzEzMzEsImFjciI6IjEiLCJhaW8iOiJBWFFBaS84YkFBQUFLejJNeUxNNGpDSDFqbUcwcG1pdXJuaWhjSXpQSUE3cUNCRlRUWnVkdVRwSlpURk9GOG9WQWhMTnpVNldGUHJPa0o4UGVHMEJJVzg2dkczbE9hdUpWczhNVEdVRHNpKzBJeFNTVCt6YzZySEtENUlyY0FHQm9OR3dhV3lGOXZFa0dnU0YzWnk2dFRiVWpDS3NVbHVvV3c9PSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiJlMjY1ODFiNy1iOGZkLTQ1Y2YtODYxMC1iODc1NzBkMWM0ZDkiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IjAxIiwiZ2l2ZW5fbmFtZSI6IlN0YWdlIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTUxLjkuMTQwLjI0NSIsIm5hbWUiOiJTdGFnZTAxIiwib2lkIjoiMTIzMGMzMzYtZTJkNC00ZGYxLWI2MWUtY2Y3MTI5OWUwZTlkIiwicHVpZCI6IjEwMDMyMDAyMTBBQjVGODYiLCJyaCI6IjEuQVhNQVM5MlphNEdXRkVTS0VodnV0bmhULVQzdmJabHNzMU5CaGdlbV9Ud0J1SjhBQU9OekFBLiIsInNjcCI6IkZpbmFuY2lhbHMuUmVhZFdyaXRlLkFsbCB1c2VyX2ltcGVyc29uYXRpb24iLCJzaWQiOiIwMDJlMWNjYS0wNGNjLTlhN2UtN2IwNy1jZGZkMTMxZWJjZDQiLCJzdWIiOiJQNGpmMlpPRGk1SzVfcngtUkhzSk8wSjhvbjdtQlhfRkZ3TjBHenRCbVRZIiwidGlkIjoiNmI5OWRkNGItOTY4MS00NDE0LThhMTItMWJlZWI2Nzg1M2Y5IiwidW5pcXVlX25hbWUiOiJTdGFnZTAxQGJzc3JsLml0IiwidXBuIjoiU3RhZ2UwMUBic3NybC5pdCIsInV0aSI6ImxPbHRvekpPeTBTd3Y0dW9LbWVhQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfYWN0X2ZjdCI6IjMgOSIsInhtc19mdGQiOiJfVTk3dTB3NmV2ZnEtSHNMOGd2Mlcybm5ZV1pkcV9ZYnczclhSTVE3RjdBQlpYVnliM0JsYm05eWRHZ3RaSE50Y3ciLCJ4bXNfaWRyZWwiOiIxIDMyIiwieG1zX3N1Yl9mY3QiOiIyIDMifQ.FOZbQV1oJZSnHwOF_vUF47byrsuSxgHsuocqwME9cXNI_HS57s3Y-VPakMWnsKMsg1hIyPP94Y-1WLIpJCBlzUqalvrvnhzaEHdgBnbr7b8Ks1b1iQ_OuuiDF-ZbUNnMbgl8uFcxZwv1Ct4eZqeuqcuW7ptSGfVMzf3yhDr3XXs_FadlYhXIrKzWYAdlixH3JOHPBc6eibtLaTx5DtpVZlM8MsFVACArCmGbUpkaiWF8jZrpyHpPNaDV61jPuXjBu0KZm5QuTmXMZFuvKuSuOkr_Hb3xgfVd99jWZomczpkUrhWmUrGtqedOZELqNEtnX6TSUxf9lTdOKbqH2tUDLw';
  constructor(private http: HttpClient) { }

  getProdotti() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get(`${this.baseUrl}prodotti`, { headers });
  }
  getClienti() {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });
  return this.http.get(`${this.baseUrl}clienti`, { headers });
  }
  getOrdini() {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  return this.http.get(`${this.baseUrl}ordini`, { headers });
}
}