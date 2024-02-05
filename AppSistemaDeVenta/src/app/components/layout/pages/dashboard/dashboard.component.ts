import { Component, inject } from '@angular/core';
import { Chart, registerables} from 'chart.js';
Chart.register(...registerables);
import { DashboardService } from '../../../../services/dashboard.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  private dashboardService = inject(DashboardService);

  totalIngresos: string = '0';
  totalVentas: string = '0';
  totalProductos: string = '0';

  mostrarGrafico(labelGrafico:any[], dataGrafico: any[]){
    const chartBarras = new Chart('chartBarras', {
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets: [{
          label: '# de Ventas',
          data: dataGrafico,
          backgroundColor:[
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1

        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }

      }
    });
  }

  ngOnInit(): void {
    this.dashboardService.resumen().subscribe({
      next: (data) => {
        if(data.status){
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;
          const arrayData:any[] = data.value.ventasUltimaSemana;
          // console.log(arrayData);
          const labelTemp = arrayData.map((item:any) => item.fecha);
          const dataTemp = arrayData.map((item:any) => item.total);
          // console.log(labelTemp, dataTemp);
          this.mostrarGrafico(labelTemp, dataTemp);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


}
