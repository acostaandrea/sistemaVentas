import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from '../../../../interfaces/venta';
import { DetalleVenta } from '../../../../interfaces/detalle-venta';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrl: './modal-detalle-venta.component.css'
})
export class ModalDetalleVentaComponent {

  public fechaRegistro: string = '';
  public numeroDocumento: string = '';
  public tipoPago: string = '';
  public total: string = '';
  public detalleVenta: DetalleVenta[] = [];
  public columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total'];

  constructor(@Inject(MAT_DIALOG_DATA) public _venta: Venta) {
    this.fechaRegistro = _venta.fechaRegistro!;
    this.numeroDocumento = _venta.numeroDocumento!;
    this.tipoPago = _venta.tipoPago;
    this.total = _venta.totalTexto;
    this.detalleVenta = _venta.detalleVenta;
  }
}
