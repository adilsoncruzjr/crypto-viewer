import { Component } from '@angular/core';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchQuery: string = ''; // Propriedade para armazenar a consulta de pesquisa
  searchResults: string[] = []; // Array para armazenar os resultados da pesquisa
  router: any;


  onSearch() {
    console.log('Search query:', this.searchQuery);
    
    // Aqui você pode chamar sua API para buscar as moedas com base na `searchQuery`.
    // Exemplo: Simulação de chamada de API
    // this.searchResults = await this.yourApiService.search(this.searchQuery);
  }
}
