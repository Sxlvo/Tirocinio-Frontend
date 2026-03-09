import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private baseUrl = 'https://api.businesscentral.dynamics.com/v2.0/6b99dd4b-9681-4414-8a12-1beeb67853f9/Sandbox_BC27/api/bs/tirocinio/v1.0/companies(14fae42a-0299-f011-a7b1-6045bdc8dcac)/';
  
  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlFaZ045SHFOa0dORU00R2VLY3pEMDJQY1Z2NCIsImtpZCI6IlFaZ045SHFOa0dORU00R2VLY3pEMDJQY1Z2NCJ9.eyJhdWQiOiJodHRwczovL2FwaS5idXNpbmVzc2NlbnRyYWwuZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNmI5OWRkNGItOTY4MS00NDE0LThhMTItMWJlZWI2Nzg1M2Y5LyIsImlhdCI6MTc3MzA3MjMzOCwibmJmIjoxNzczMDcyMzM4LCJleHAiOjE3NzMwNzcyOTAsImFjciI6IjEiLCJhaW8iOiJBWFFBaS84YkFBQUFCZWdiakhDZklXOWpBalIyY2c0K0N6S0xaeGlmU1RXb2xpNkc4ZXhQRHlSU0NnSHNubHJ2NFl1N0NoOC9ncXl4WExXWkpiQkFrUC84Z3k0RDhnOXpwYzJVRkhPdHlEZE5mV0ZuVC91cFp4bUk0QnFRVFRrUGdFQS9OTjF3Y1RiaDFHUjhSS2lwQUdtVE5mT3cxOFRwT0E9PSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiJlMjY1ODFiNy1iOGZkLTQ1Y2YtODYxMC1iODc1NzBkMWM0ZDkiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IjAxIiwiZ2l2ZW5fbmFtZSI6IlN0YWdlIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTUxLjkuMTQwLjI0NSIsIm5hbWUiOiJTdGFnZTAxIiwib2lkIjoiMTIzMGMzMzYtZTJkNC00ZGYxLWI2MWUtY2Y3MTI5OWUwZTlkIiwicHVpZCI6IjEwMDMyMDAyMTBBQjVGODYiLCJyaCI6IjEuQVhNQVM5MlphNEdXRkVTS0VodnV0bmhULVQzdmJabHNzMU5CaGdlbV9Ud0J1SjhBQU9OekFBLiIsInNjcCI6IkZpbmFuY2lhbHMuUmVhZFdyaXRlLkFsbCB1c2VyX2ltcGVyc29uYXRpb24iLCJzaWQiOiIwMDJlMWNjYS0wNGNjLTlhN2UtN2IwNy1jZGZkMTMxZWJjZDQiLCJzdWIiOiJQNGpmMlpPRGk1SzVfcngtUkhzSk8wSjhvbjdtQlhfRkZ3TjBHenRCbVRZIiwidGlkIjoiNmI5OWRkNGItOTY4MS00NDE0LThhMTItMWJlZWI2Nzg1M2Y5IiwidW5pcXVlX25hbWUiOiJTdGFnZTAxQGJzc3JsLml0IiwidXBuIjoiU3RhZ2UwMUBic3NybC5pdCIsInV0aSI6IkxxRmxjaDFaT0UtcXFtXzNIaUFMQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfYWN0X2ZjdCI6IjMgOSIsInhtc19mdGQiOiI2TVFtZ1hNUk8zbVBIdlk3SVEyaVVIdTlzZEhHZnhYd3l3akxSSi12VXFNQlpYVnliM0JsZDJWemRDMWtjMjF6IiwieG1zX2lkcmVsIjoiMiAxIiwieG1zX3N1Yl9mY3QiOiIzIDE4In0.hViAHqeguFmx5fa7s0mGNSWOmg1jhGIGDOipC0yBSDYXANuwMlkP_pTvJf45LC2y0j5OXfMB7G7eEFlA32243qUBw3_zJhQnQTI6c-QxebrXekHTB1EGx1O6vZCY8xsqdx6waq5Ujl7Bj3uT8owQf5BZda1F68X_ZCecCsDUVl0HU_AUYRC15uulqmRvMi7EaSieVYCFNNdQBvZkpSG6F7FQWg3NVHD6-cfzZIwmzcEHrZNm7B3wF0Y3TUS4G_7wxkRXLVtYZVsusUlSjKWExtuVJaOtbG1ZGiCA_U9-ZvKAZe2TdwolEdEGyxNGqOy5OwCIRkoN57sfbOrQmC4LhA';
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