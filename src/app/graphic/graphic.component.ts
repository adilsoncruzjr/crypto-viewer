import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Importa o adaptador de data
import { CryptoService } from '../crypto.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements AfterViewInit, OnDestroy {
  coinId: string = '';  // Variável para armazenar o ID da moeda
  selectedDays: number = 7; // Intervalo de tempo padrão
  chartInstance: Chart | null = null; // Referência ao gráfico


  constructor(
    private cryptoService: CryptoService,
    private route: ActivatedRoute, // Injeta o ActivatedRoute para capturar parâmetros da URL 
    private router: Router
  ) {

    // Registra todos os elementos padrão do Chart.js
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    // Verifica e pega o coinId logo no início, pode ser via parâmetros de rota ou queryParams
    this.route.queryParams.subscribe(params => {
      this.coinId = params['id'] || ''; // Garante que o coinId seja capturado
      console.log('ID da moeda recebida:', this.coinId);
      if (this.coinId) {
        this.loadCoinData();
      }
    });

  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      this.coinId = params['id'];
      console.log('ID da moeda recebida:', this.coinId);
      if (this.coinId) {
        this.loadCoinData();
      }
    });
  }

  changeTimeRange(days: number): void {
    this.selectedDays = days;
    this.loadCoinData();
  }

  loadCoinData(): void {
    this.cryptoService.getCoinMarketData(this.coinId, this.selectedDays).subscribe(data => {
      const prices = data.prices.map((price: [number, number]) => ({
        x: price[0],
        y: price[1]
      }));

      this.renderChart(prices);
    }, error => {
      console.error('Erro ao carregar os dados da moeda:', error);
    });
  }

  renderChart(data: { x: number; y: number }[]): void {
    const canvas = document.getElementById('myLineChart') as HTMLCanvasElement;

    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null; // Limpa a referência
    }

    if (canvas) {
      // Ajusta a unidade do eixo x com base no intervalo de dias selecionado
      const timeUnit = this.selectedDays === 1 ? 'hour' : 'day';

      this.chartInstance = new Chart(canvas, {
        type: 'line' as ChartType,
        data: {
          datasets: [
            {
              label: 'Preço da moeda (USD)',
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
                unit: timeUnit // Define a unidade (hora ou dia)
              },
              title: {
                display: true,
                text: this.selectedDays === 1 ? 'Horas' : 'Data'
              }
            },
            y: {
              title: { display: true, text: 'USD' }
            }
          },
          plugins: { legend: { display: true, position: 'top' } }
        }
      });
    } else {
      console.error('Canvas não encontrado!');
    }
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
  // Função para voltar para a página /wallet
  goBack() {
    this.router.navigate(['/wallet']);
  }

}
