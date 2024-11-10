import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoService } from '../crypto.service';

interface Coin {
  name: string;
  id: string;
  value?: number;  // Adiciona a propriedade value, que pode ser opcional
}

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})

export class WalletComponent {
  userName: string = '';  // Nome do usuário
  userCoins: Coin[] = [];  // Agora o tipo de userCoins é Coin[] (um array de objetos Coin)

  constructor(
    private router: Router,
    private cryptoService: CryptoService // Injete o CryptoService
  ) {}

  ngOnInit(): void {
    const user = this.cryptoService.getUser();  // Obtém os dados do usuário
    const userId = user?.id;

    if (userId) {
      console.log('Buscando moedas do backend para o usuário com ID:', userId);
      this.loadCoins(userId);  // Carregar as moedas do backend
    }
  }

  // Método para carregar as moedas do usuário
  loadCoins(userId: number): void {
    this.cryptoService.getCoins(userId).subscribe(
      (coins) => {
        console.log('Resposta das moedas recebidas:', coins);
  
        if (Array.isArray(coins)) {
          // Atualiza a lista de moedas, agora incluindo o id e o nome
          this.userCoins = coins.map((coin: any) => ({
            name: coin.name,   // Nome da moeda
            id: coin.id,       // ID da moeda
          }));
  
          console.log('Lista de moedas atualizada:', this.userCoins);
        } else {
          console.error('A resposta não é um array válido:', coins);
        }
      },
      (error) => {
        console.error('Erro ao carregar moedas:', error);
      }
    );
  }

  // Método de logout
  logout() {
    console.log('Iniciando processo de logout...');
    this.cryptoService.logout().subscribe(
      (response) => {
        console.log('Logout bem-sucedido:', response);  // Log após o logout
        // Limpa os dados do usuário após o logout
        this.cryptoService.clearUserData();

        // Redireciona para a página inicial (AppComponent)
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Erro ao fazer logout:', error);  // Log de erro ao fazer logout
      }
    );
  }

  // Método para adicionar uma moeda
  addCoin(coinName: string, coinId: string) {
    console.log('Tentando adicionar moeda:', coinName);  // Log do nome da moeda que está sendo adicionada
    if (coinName && coinId) {
      const randomValue = Math.random() * 10000; // Valor aleatório para a moeda
      console.log('Valor gerado para a moeda:', randomValue);  // Log do valor aleatório gerado
      this.userCoins.push({ name: coinName, id: coinId });  // Armazenar o nome e o id da moeda
      console.log('Lista de moedas após adição:', this.userCoins);  // Log da lista de moedas após adição
    }
  }

  // Método para selecionar uma moeda e adicionar ao backend
  onCoinSelected(coin: Coin) {
    const user = this.cryptoService.getUser();  // Obtém os dados do usuário
    const userId = user?.id;  // Obtém o identificador do usuário
  
    if (userId && coin.name && coin.id) {
      // Chama o serviço addCoins com três parâmetros: userId, coinId, coinName
      this.cryptoService.addCoins(userId, coin.id, coin.name).subscribe(
        (response) => {
          console.log('Moeda adicionada com sucesso:', response.message);
  
          // Após adicionar a moeda com sucesso, recarrega a lista de moedas
          this.loadCoins(userId);
        },
        (error) => {
          console.error('Erro ao adicionar moeda:', error);
        }
      );
  
      // Chama a função addCoin passando tanto o name quanto o id
      this.addCoin(coin.name, coin.id);  // Passa o name e o id para addCoin
    }
  }

  // Método para deletar uma moeda
  deleteCoin(index: number) {
    const user = this.cryptoService.getUser();  // Obtém os dados do usuário
    const userId = user?.id;  // Obtém o ID do usuário
  
    if (userId) {
      const coinName = this.userCoins[index].name;  // Agora usamos o nome da moeda (não o id)
  
      // Chama o serviço para deletar a moeda
      this.cryptoService.deleteCoin(userId, coinName).subscribe(response => {
        console.log('Resposta do servidor:', response);
  
        // Remover a moeda localmente da lista de moedas
        this.userCoins.splice(index, 1);
        console.log('Moedas após remoção:', this.userCoins);
      }, error => {
        console.error('Erro ao remover moeda:', error);
      });
    } else {
      console.error('ID do usuário não encontrado. A moeda não pode ser removida.');
    }
  }

  // Método para visualizar os detalhes de uma moeda
  viewCoin(coin: Coin) {
    console.log('Visualizando moeda:', coin);  // Log da moeda que está sendo visualizada
    this.router.navigate(['/graphic'], { queryParams: { id: coin.id } });  // Passando 'id' ao invés de 'name'
  } 
  

}
