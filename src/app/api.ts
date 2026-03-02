import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  // 1. INCOLLA QUI L'URL DELLE TUE API (fermati a /v1.0/companies(tuo-id)/ )
  private baseUrl = 'https://api.businesscentral.dynamics.com/v2.0/6b99dd4b-9681-4414-8a12-1beeb67853f9/Sandbox/api/bs/tirocinio/v1.0/companies(fca3511e-7a01-f111-a1f9-7ced8d268eae)/';
  
  // 2. INCOLLA QUI IL TOKEN DI POSTMAN
  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InNNMV95QXhWOEdWNHlOLUI2ajJ4em1pazVBbyIsImtpZCI6InNNMV95QXhWOEdWNHlOLUI2ajJ4em1pazVBbyJ9.eyJhdWQiOiJodHRwczovL2FwaS5idXNpbmVzc2NlbnRyYWwuZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNmI5OWRkNGItOTY4MS00NDE0LThhMTItMWJlZWI2Nzg1M2Y5LyIsImlhdCI6MTc3MjQ2MTQyOCwibmJmIjoxNzcyNDYxNDI4LCJleHAiOjE3NzI0NjYzOTIsImFjciI6IjEiLCJhaW8iOiJBWFFBaS84YkFBQUEybXRzRmZpRFpVSGl2a1ZjMkk2VUpsMzUydWpsbEhVRmk2Ymw3cmg3UXVvekcxNEpCUHRibmpMSlhjT2lZMFpJbGJaK2IvYk1TcndBYmdWTnZKaWlmVjlvcENQQ1Bic3NQSkJoMUhUYlh5cnVTbFpNT3hUdUkwYWEvR2NhN0Z5ZFFEdDZiU0MxMzlGVmhLbzlOeXpwbnc9PSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiJlMjY1ODFiNy1iOGZkLTQ1Y2YtODYxMC1iODc1NzBkMWM0ZDkiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IjAxIiwiZ2l2ZW5fbmFtZSI6IlN0YWdlIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTUxLjkuMTQwLjI0NSIsIm5hbWUiOiJTdGFnZTAxIiwib2lkIjoiMTIzMGMzMzYtZTJkNC00ZGYxLWI2MWUtY2Y3MTI5OWUwZTlkIiwicHVpZCI6IjEwMDMyMDAyMTBBQjVGODYiLCJyaCI6IjEuQVhNQVM5MlphNEdXRkVTS0VodnV0bmhULVQzdmJabHNzMU5CaGdlbV9Ud0J1SjhBQU9OekFBLiIsInNjcCI6IkZpbmFuY2lhbHMuUmVhZFdyaXRlLkFsbCB1c2VyX2ltcGVyc29uYXRpb24iLCJzaWQiOiIwMDJlMWNjYS0wNGNjLTlhN2UtN2IwNy1jZGZkMTMxZWJjZDQiLCJzdWIiOiJQNGpmMlpPRGk1SzVfcngtUkhzSk8wSjhvbjdtQlhfRkZ3TjBHenRCbVRZIiwidGlkIjoiNmI5OWRkNGItOTY4MS00NDE0LThhMTItMWJlZWI2Nzg1M2Y5IiwidW5pcXVlX25hbWUiOiJTdGFnZTAxQGJzc3JsLml0IiwidXBuIjoiU3RhZ2UwMUBic3NybC5pdCIsInV0aSI6IjRZOTRYY3JQeGtTLXdDQS1BdU1OQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfYWN0X2ZjdCI6IjkgMyIsInhtc19mdGQiOiI1blJOZFBNcXhacGkzNXdWYm5qdmJLa2xOQ2NQUEpMS1l2LWtqOUVQVVBjQlpYVnliM0JsZDJWemRDMWtjMjF6IiwieG1zX2lkcmVsIjoiMSAxOCIsInhtc19zdWJfZmN0IjoiMyA0In0.MN_mn0viTZOKmuLswNnWKXLlJN512YflPKZeuqlGRhh95bnWu_emmo6XMlNOPvkD6O1E-IKJNhxqiOed62jAe36ETzUKame4mJhlwk3qYhNAQfwy3wTNSafjm3BfysVUkm-84CN7GuQt01CQ2NjU0M3U80K79SS6NRUqBH0YX1vImN_sFC_OEbSDgJrqJHr7BpT_dIBtFcrj6KDc8dqV_tMKNGoWNVVOtAancZEvniCEaEPXPMd8-3h8TGtEAV9YyYwUKj4qIUzDIcQF9bmPISdprCnV_ZjiqZz2KxscI-KNB0au64-eP6lvSHax1PVKIHX9hiynonIz2XT1Cj20jA';
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