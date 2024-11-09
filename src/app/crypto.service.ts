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

 // Método para login
 loginUser(email: string, password: string): Observable<any> {
  const loginData = { email, password };
  return this.http.post<any>(`${this.apiUrl}/login`, loginData);
}

// Método para obter o token armazenado
getToken(): string | null {
  return this.token || localStorage.getItem('auth_token');
}

// Método para armazenar o token no serviço e no localStorage
setToken(token: string): void {
  this.token = token;
  localStorage.setItem('auth_token', token); // Armazenar no localStorage
}

// Método para obter os dados do usuário (caso precise)
getUser(): any {
  return JSON.parse(localStorage.getItem('user') || '{}');
}

// Método para armazenar os dados do usuário
setUser(user: any): void {
  localStorage.setItem('user', JSON.stringify(user));
}

// Método para logout
logout(): Observable<any> {
  const token = this.getToken(); // Obtém o token do localStorage ou do serviço
  
  if (token) {
    // Faz a requisição de logout passando o token no header
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Se não houver token, encerra a observável imediatamente
  return new Observable(observer => observer.complete());
}

// Método para limpar o token e os dados do usuário após o logout
clearUserData(): void {
  this.token = null;
  localStorage.removeItem('auth_token'); // Remove o token do localStorage
  localStorage.removeItem('user'); // Remove os dados do usuário do localStorage
}

// Métodos adicionais para buscar dados de criptos
searchCryptos(query: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/cryptos/suggestions?query=${query}`);
}

searchSuggestions(query: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/cryptos/suggestions?query=${query}`);
}

getAllCoins(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/coins/all`);
}

getBitcoinMarketData(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/bitcoin-market-data`);
}

registerUser(name: string, email: string, password: string, passwordConfirmation: string): Observable<any> {
  const userData = {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation
  };

  return this.http.post<any>(`${this.apiUrl}/register`, userData);
}

addCoins(userId: number, coinName: string): Observable<any> {
  const amount = 1; // Adiciona 1 moeda por padrão
  return this.http.post(`${this.apiUrl}/wallet/${userId}/add-coins`, {
    coin_name: coinName,
    amount: amount,
  });
}


getCoins(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/wallet/${userId}/coins`);
}

}
