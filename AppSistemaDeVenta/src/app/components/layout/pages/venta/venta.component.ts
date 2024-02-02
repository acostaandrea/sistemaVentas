import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Venta } from '../../../../interfaces/venta';
import { VentaService } from '../../../../services/venta.service';
import { Producto } from '../../../../interfaces/producto';
import { ProductoService } from '../../../../services/producto.service';
import { UtilidadService } from '../../../../reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { DetalleVenta } from '../../../../interfaces/detalle-venta';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent {

  private fb = inject(FormBuilder);
  private ventaService = inject(VentaService);
  private productoService = inject(ProductoService);
  private utilidadService = inject(UtilidadService);

  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];
  listaProductosVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar = false;
  productoSeleccionado!: Producto;
  tipoPagoPorDefecto: string = 'Efectivo';
  totalPagar: number = 0;
  formularioVenta: FormGroup;
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total','acciones'];
  datosDetalleVenta= new MatTableDataSource<DetalleVenta>(this.listaProductosVenta);

  retornarProductoPorFiltro(busqueda:any): Producto[]{
    const valorBuscado = typeof busqueda === 'string' ? busqueda.toLowerCase() : busqueda.nombre.toLowerCase();
    return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  constructor() {
    this.formularioVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required]
    });
    this.productoService.lista().subscribe({
      next: (data) => {
        if (data.status){
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(item => item.esActivo == 1 && item.stock > 0);
        };
      },
      error: (error) => {
      }
    });
    this.formularioVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.retornarProductoPorFiltro(value);
    });
  }

  mostrarProducto(producto : Producto):string{
    return producto.nombre;
  }

  productoParaVenta(event:any){
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoVenta(){
    const _cantidad: number = this.formularioVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad * _precio;
    this.totalPagar += _total;
    this.listaProductosVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2)),
    });
    this.datosDetalleVenta = new MatTableDataSource<DetalleVenta>(this.listaProductosVenta);
    this.formularioVenta.patchValue({
      producto: '',
      cantidad: ''
    });
  }

  eliminarProductoVenta(detalle: DetalleVenta){
    this.totalPagar -= parseFloat(detalle.totalTexto);
    this.listaProductosVenta = this.listaProductosVenta.filter(item => item.idProducto != detalle.idProducto);
    this.datosDetalleVenta = new MatTableDataSource<DetalleVenta>(this.listaProductosVenta);
  }

  registrarVenta(){
    if(this.listaProductosVenta.length > 0){
      this.bloquearBotonRegistrar = true;
      const request: Venta = {
        tipoPago: this.tipoPagoPorDefecto,
        totalTexto: String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductosVenta
      }
      this.ventaService.registrar(request).subscribe({
        next: (data) => {
          if (data.status){
            this.totalPagar = 0.00;
            this.listaProductosVenta = [];
            this.datosDetalleVenta = new MatTableDataSource<DetalleVenta>(this.listaProductosVenta);
            Swal.fire({
              icon: 'success',
              title: 'Venta registrada',
              text: `Numero de venta ${data.value.numeroDocumento}`,
              });

          }else{
            this.utilidadService.mostrarAlerta(data.msg, 'error');
          }
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        },
        error: (error) => {
          console.log(error);
        }
      });
    }

  }

}
