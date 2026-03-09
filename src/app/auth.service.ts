import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlFaZ045SHFOa0dORU00R2VLY3pEMDJQY1Z2NCIsImtpZCI6IlFaZ045SHFOa0dORU00R2VLY3pEMDJQY1Z2NCJ9.eyJhdWQiOiJodHRwczovL2FwaS5idXNpbmVzc2NlbnRyYWwuZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNmI5OWRkNGItOTY4MS00NDE0LThhMTItMWJlZWI2Nzg1M2Y5LyIsImlhdCI6MTc3MzA3MTkyMSwibmJmIjoxNzczMDcxOTIxLCJleHAiOjE3NzMwNzY4NjEsImFjciI6IjEiLCJhaW8iOiJBWFFBaS84YkFBQUF0V3htRGUwTzhhRS96aHJzenRJWWM4cDl3RFFyczV6SUhnenZWZVVMRE1YQjUwdVV4UmZMVU92eVRPNzNsQ0FMYnRYZ25RYnBzd1lzWis1azU3UnJtUU5ENDdGdzB3REhraXV5OE1RZDFVRGEyT3lRNnVvUEhHRS81Q051ck1hUGQwTE5oZHlaRTA5dnA3UDdFYWJpNUE9PSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiJlMjY1ODFiNy1iOGZkLTQ1Y2YtODYxMC1iODc1NzBkMWM0ZDkiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IjAxIiwiZ2l2ZW5fbmFtZSI6IlN0YWdlIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMTUxLjkuMTQwLjI0NSIsIm5hbWUiOiJTdGFnZTAxIiwib2lkIjoiMTIzMGMzMzYtZTJkNC00ZGYxLWI2MWUtY2Y3MTI5OWUwZTlkIiwicHVpZCI6IjEwMDMyMDAyMTBBQjVGODYiLCJyaCI6IjEuQVhNQVM5MlphNEdXRkVTS0VodnV0bmhULVQzdmJabHNzMU5CaGdlbV9Ud0J1SjhBQU9OekFBLiIsInNjcCI6IkZpbmFuY2lhbHMuUmVhZFdyaXRlLkFsbCB1c2VyX2ltcGVyc29uYXRpb24iLCJzaWQiOiIwMDJlMWNjYS0wNGNjLTlhN2UtN2IwNy1jZGZkMTMxZWJjZDQiLCJzdWIiOiJQNGpmMlpPRGk1SzVfcngtUkhzSk8wSjhvbjdtQlhfRkZ3TjBHenRCbVRZIiwidGlkIjoiNmI5OWRkNGItOTY4MS00NDE0LThhMTItMWJlZWI2Nzg1M2Y5IiwidW5pcXVlX25hbWUiOiJTdGFnZTAxQGJzc3JsLml0IiwidXBuIjoiU3RhZ2UwMUBic3NybC5pdCIsInV0aSI6ImxfNVU4MHNOSzBTYUZSVUZTUlZCQVEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfYWN0X2ZjdCI6IjkgMyIsInhtc19mdGQiOiJhVlRlVWg4TVdwSERnX2dRWDNOSXc5VENxQlQtZkFCY0NJcl82TzFZUnhNQlpYVnliM0JsZDJWemRDMWtjMjF6IiwieG1zX2lkcmVsIjoiMSAxMCIsInhtc19zdWJfZmN0IjoiMTYgMyJ9.hgABZvBfSXxUdU-6XEfK8Rk8HBlqPDVrLDRReyfQKcywb3WWfIjS9Sx-PxznTtEWUBUrcePm9FdChADer29d7AQXzferhJ3NfEMsKHg-uLbZwebNLqWdzqA65lIsgh1g4p0ButiDRTFAeKkdFz-Q77uQKFcNrYI96V2DQUY3GuN-Es7Mn3jcVkX2hEcL_2Y8T8sgE4sXrD0w-chyb2WkjCsWwisfSwMylLKScjVxpDGTxlNLlPRoGFZ_5sry6VHPW5Ksyhei-eE-UOLzOdzTW_1AKb0jdtsypkh3XJPi1queoWxihYz4t1Abz8mrvsfqoBLgMtlXVND-VPoEN8v-Xg';

  private baseUrl =
    "https://api.businesscentral.dynamics.com/v2.0/6b99dd4b-9681-4414-8a12-1beeb67853f9/Sandbox_BC27/ODataV4/Company(Id=14fae42a-0299-f011-a7b1-6045bdc8dcac)/AgentLoginWS";

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
  }

  private escapeODataString(value: string): string {
    return value.replace(/'/g, "''");
  }

  login(email: string, password: string): Observable<boolean> {
    const safeEmail = this.escapeODataString(email.trim());
    const findUrl = `${this.baseUrl}?$filter=E_Mail eq '${safeEmail}'`;

    return this.http.get<any>(findUrl, { headers: this.getHeaders() }).pipe(
      switchMap((res) => {
        const agent = res?.value?.[0];

        if (!agent || !agent.Code) {
          return of(false);
        }

        const agentCode = agent.Code;
        const verifyUrl = `${this.baseUrl}('${agentCode}')/NAV.VerifyCredentials`;

        const body = {
          email: email.trim(),
          userPassword: password
        };

        return this.http.post<any>(verifyUrl, body, { headers: this.getHeaders() }).pipe(
          map((loginRes) => {
            const result = loginRes?.value ?? '';

            if (typeof result === 'string' && result.startsWith('Success:')) {
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('userEmail', email.trim());
              localStorage.setItem('userName', result.replace('Success:', '').trim());
              localStorage.setItem('agentCode', agentCode);
              return true;
            }

            return false;
          })
        );
      })
    );
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('agentCode');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getUserName(): string {
    return localStorage.getItem('userName') || '';
  }
}