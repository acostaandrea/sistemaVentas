import { Component, AfterViewInit, ViewChild, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import { ModalDetalleVentaComponent } from '../../modals/modal-detalle-venta/modal-detalle-venta.component';
import { Venta } from '../../../../interfaces/venta';
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
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrl: './historial-venta.component.css',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class HistorialVentaComponent implements AfterViewInit{

  private ventaService = inject(VentaService);
  private utilidadService = inject(UtilidadService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  formularioBusqueda: FormGroup;
  opcionesBusqueda: any[] = [{value: "fecha", descripcion: "Por Fechas"},{value: "numero", descripcion: "Número de Venta"}];
  columnasTabla: string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'accion'];
  dataInicio: Venta[] = [];
  datosListaVenta = new MatTableDataSource<Venta>(this.dataInicio);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      numero: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });
    this.formularioBusqueda.get('buscarPor')?.valueChanges.subscribe(value =>{
      this.formularioBusqueda.patchValue({numero: '', fechaInicio: '', fechaFin: ''});
    })

  }

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginator;
  }
  aplicarFiltro(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaVenta.filter = filterValue.trim().toLowerCase();
    console.log(this.datosListaVenta);
  }

  buscarVentas(){
    let _fechaInicio: string = "";
    let _fechaFin: string = "";
    if(this.formularioBusqueda.value.buscarPor == "fecha"){
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');
      if(_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date'){
        this.utilidadService.mostrarAlerta('Debe ingresar ambas fechas', 'Error');
        return;
      }
    }
    this.ventaService.historial(this.formularioBusqueda.value.buscarPor, this.formularioBusqueda.value.numero, _fechaInicio, _fechaFin).subscribe({
      next: (data) => {
        if(data.status) {
          this.datosListaVenta= data.value;
          // Update the paginator's length
          this.paginator.length = data.value.length;
          // Reset paginator to the first page
          this.paginator.firstPage();
        }else{
          this.utilidadService.mostrarAlerta('No se encontraron datos', 'Error');
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  verDetalleVenta(venta: Venta){
    this.dialog.open(ModalDetalleVentaComponent, {
      width: '40rem',
      data: venta,
      disableClose: true
    });

  }

}
