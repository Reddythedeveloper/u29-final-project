import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Point to your DigitalOcean IP or domain. 
  // Since we are running locally for now, we use the relative path or IP.
  // Ideally, use the public IP of your droplet if testing from outside.
  // For local testing on the server, localhost:3000 works if tunneling.
  // BUT: For a real deployed app, this needs to be your Droplet IP.
  private apiUrl = ''; 

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{token: string}>(`${this.apiUrl}/api/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
