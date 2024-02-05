import { Component, AfterViewInit, ViewChild, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import* as xlsx from 'xlsx';
import { Reporte } from '../../../../interfaces/reporte';
import { VentaService } from '../../../../services/venta.service';
import { UtilidadService } from '../../../../reutilizable/utilidad.service';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class ReporteComponent {

  private ventaService = inject(VentaService);
  private utilidadService = inject(UtilidadService);
  private fb = inject(FormBuilder);

  formularioFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  columnasTabla: string[] = ['fechaRegistro', 'numeroVenta', 'tipoPago', 'total', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataVentaReporte = new MatTableDataSource<Reporte>(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginator;
  }

  buscarVentas(){
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');
    if(_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date'){
      this.utilidadService.mostrarAlerta('Debe ingresar ambas fechas', 'Error');
      return;
    }
    this.ventaService.reporte(_fechaInicio, _fechaFin).subscribe({
      next: (data) => {
        if(data.status){
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
        }else{
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this.utilidadService.mostrarAlerta("No se encontraron datos", 'Error');
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  exportarExcel(){
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(this.listaVentasReporte);
    xlsx.utils.book_append_sheet(wb, ws, 'Reporte');
    xlsx.writeFile(wb, 'Reporte Ventas.xlsx');
  }

}
