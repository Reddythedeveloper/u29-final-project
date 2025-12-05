import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = '/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Helper to add the JWT token to the header
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getChart1Data(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chart1`, { headers: this.getHeaders() });
  }

  getChart2Data(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chart2`, { headers: this.getHeaders() });
  }
}
