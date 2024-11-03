import { Component, AfterViewInit } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Importa o adaptador de data
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements AfterViewInit {

  constructor(private cryptoService: CryptoService) {
    // Registra todos os elementos padrão do Chart.js
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    // Carrega os dados e renderiza o gráfico após a visualização estar pronta
    this.loadBitcoinData();
  }

  loadBitcoinData(): void {
    this.cryptoService.getBitcoinMarketData().subscribe(data => {
      const prices = data.prices.map((price: [number, number]) => ({
        x: price[0], // Timestamp em milissegundos
        y: price[1]  // Preço do Bitcoin em USD
      }));

      this.renderChart(prices);
    });
  }

  renderChart(data: { x: number; y: number }[]): void {
    const ctx = document.getElementById('myLineChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'line' as ChartType, // Define o tipo de gráfico como "line"
      data: {
        datasets: [
          {
            label: 'Bitcoin Price (USD)',
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
