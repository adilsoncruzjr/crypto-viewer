import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private apiUrl = 'http://localhost:8000/api'; // URL da API Laravel
  private token: string | null = null; // Armazenamento local para o token

  constructor(private http: HttpClient) { }

  loginUser(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout(): Observable<any> {
    const token = this.getToken();

    if (token) {
      return this.http.post<any>(`${this.apiUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return new Observable(observer => observer.complete());
  }
  clearUserData(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  registerUser(name: string, email: string, password: string, password_confirmation: string): Observable<any> {
    const userData = { name, email, password, password_confirmation };
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  addCoins(userId: number, coinId: string, coinName: string): Observable<any> {
    const amount = 1;
    return this.http.post(`${this.apiUrl}/wallet/${userId}/add-coins`, {
      coin_id: coinId,
      coin_name: coinName,
      amount: amount
    });
  }

  getCoins(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/wallet/${userId}/coins`);
  }

  deleteCoin(userId: number, coinName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/wallet/${userId}/coin`, {
      body: { coin_name: coinName }
    });
  }

  searchCryptos(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cryptos/suggestions?query=${query}`);
  }

  searchSuggestions(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cryptos/suggestions?query=${query}`);
  }

  getAllCoins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/coins/all`);
  }

  getCoinMarketData(coinId: string, days: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/coin-market-data/${coinId}?days=${days}`);
  }

  checkEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/check-email?email=${email}`);
  }


}
