import { Component, AfterViewInit } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Importa o adaptador de data
import { CryptoService } from '../crypto.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements AfterViewInit 
{
  coinId: string = '';  // Variável para armazenar o ID da moeda

  constructor(
    private cryptoService: CryptoService,
    private route: ActivatedRoute // Injeta o ActivatedRoute para capturar parâmetros da URL 
  ) {
    
    // Registra todos os elementos padrão do Chart.js
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    // Captura o ID da moeda a partir dos parâmetros da URL
    this.route.queryParams.subscribe(params => {
      this.coinId = params['id']; // Captura o 'name' da moeda como o coinId
      console.log('ID da moeda recebida:', this.coinId);  // Log para verificar o ID

      if (this.coinId) {
        this.loadCoinData(this.coinId);  // Carrega os dados do gráfico usando o coinId
      }
    });
  }

  // Função para carregar os dados do mercado da moeda
  loadCoinData(coinId: string): void {
    this.cryptoService.getCoinMarketData(coinId).subscribe(data => {
      const prices = data.prices.map((price: [number, number]) => ({
        x: price[0], // Timestamp em milissegundos
        y: price[1]  // Preço da moeda em USD
      }));

      this.renderChart(prices);  // Chama a função para renderizar o gráfico
    }, error => {
      console.error('Erro ao carregar os dados da moeda:', error);
    });
  }

  // Função para renderizar o gráfico com os dados recebidos
  renderChart(data: { x: number; y: number }[]): void {
    const ctx = document.getElementById('myLineChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'line' as ChartType, // Define o tipo de gráfico como "line"
      data: {
        datasets: [
          {
            label: 'Price of Coin (USD)',
            data: data,
            borderColor: 'rgba(75, 192, 192, 0.6)',
            fill: false,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day' // Mostra os dados em intervalos de dias
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price in USD'
            }
          }
        },
        plugins: {
          legend: { display: true, position: 'top' }
        }
      }
    });
  }
}
