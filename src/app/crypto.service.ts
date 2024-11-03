import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private apiUrl = 'http://localhost:8000/api'; // URL da API Laravel

  constructor(private http: HttpClient) { }

  searchCryptos(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cryptos/suggestions?query=${query}`);
  }

  searchSuggestions(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cryptos/suggestions?query=${query}`);
  }

  getAllCoins(): Observable<any[]> {
    // Implemente a chamada da API para buscar todas as moedas
    return this.http.get<any[]>(`${this.apiUrl}/coins/all`); // Ajuste a URL conforme a sua API
  }

  getBitcoinMarketData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bitcoin-market-data`);
  }
}
