import { Component, AfterViewInit } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrl: './graphic.component.css'
})
export class GraphicComponent  implements AfterViewInit  {

  constructor() {
    // Registra todos os elementos padrão do Chart.js
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    const ctx = document.getElementById('myBarChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'bar' as ChartType, // Define o tipo de gráfico como "bar"
      data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
        datasets: [
          {
            label: 'Vendas',
            data: [30, 50, 80, 40, 60],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' }
        }
      }
    });
  }
}