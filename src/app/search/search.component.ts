import { Component } from '@angular/core';
import { CryptoService } from '../crypto.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchQuery: string = '';
  searchResults: any[] = [];
  private searchTerms = new Subject<string>();
  selectedCoin: string = '';

  constructor(private cryptoService: CryptoService) {
    console.log('SearchComponent initialized');
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      console.log('Searching for suggestions with term:', term);
      this.searchSuggestions(term);
    });
  }

  searchSuggestions(query: string) {
    console.log('searchSuggestions called with query:', query);
    
    if (query) {
      this.cryptoService.searchSuggestions(query).subscribe(
        (data: any) => {
          console.log('Received search suggestions:', data);
          
          const normalizedQuery = query.toLowerCase().trim();
  
          // Verifique se data é um objeto e converta em array
          const coinsArray = Array.isArray(data) ? data : Object.values(data);
          
          this.searchResults = coinsArray.filter((coin: any) => 
            coin.name.toLowerCase().includes(normalizedQuery) || 
            coin.symbol.toLowerCase().includes(normalizedQuery)
          );
  
          console.log('Filtered results with substring match:', this.searchResults);
        },
        (error: any) => {
          console.error('Erro ao buscar sugestões:', error);
        }
      );
    } else {
      console.log('Empty query, resetting searchResults');
      this.searchResults = [];
    }
  }

  getSimilarSuggestions(query: string) {
    // Aqui você pode adicionar lógica para buscar sugestões de moedas alternativas
    console.log('Fetching similar suggestions for query:', query);
    
    // Exemplo: talvez você tenha uma lista de todas as moedas que pode usar para comparação
    this.cryptoService.getAllCoins().subscribe(
      (allCoins: any[]) => {
        this.searchResults = allCoins.filter(coin => 
          coin.name.toLowerCase().includes(query) || 
          coin.symbol.toLowerCase().includes(query)
        );
        console.log('Similar suggestions found:', this.searchResults);
      },
      (error: any) => {
        console.error('Erro ao buscar todas as moedas:', error);
      }
    );
  }

  onInputChange(query: string) {
    console.log('Input changed, new query:', query);
    this.searchTerms.next(query);
  }

  onEnterKey() {
    if (this.searchQuery) {
      // Busca a moeda exata ao pressionar Enter
      this.cryptoService.searchSuggestions(this.searchQuery).subscribe(
        (data: any) => {
          console.log('Received data for exact search:', data);
          
          const normalizedQuery = this.searchQuery.toLowerCase().trim();
          
          // Verifique se data é um array
          if (Array.isArray(data)) {
            this.searchResults = data.filter(
              (coin: any) => coin.name.toLowerCase() === normalizedQuery || coin.symbol.toLowerCase() === normalizedQuery
            );

            // Caso não encontre exato, exibe sugestões similares
            if (this.searchResults.length === 0) {
              console.log('Exact match not found, searching for similar suggestions');
              this.searchSuggestions(this.searchQuery);
            }
          } else {
            console.error('Expected data to be an array for exact search, but got:', data);
            this.searchResults = []; // Resetar resultados se não for um array
          }
        },
        (error: any) => {
          console.error('Erro ao buscar moeda exata:', error);
        }
      );
    }
  }

  selectCoin(coin: any) {
    // Preencher o campo de pesquisa com o nome da moeda
    this.searchQuery = coin.name; // ou use coin.symbol, conforme necessário
    this.selectedCoin = coin.name; // Armazenar a moeda selecionada
    this.searchResults = []; // Limpa as sugestões
    console.log('Selected coin:', coin);
  }

}
