import { Component, AfterViewInit, ViewChild, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ModalProductoComponent } from '../../modals/modal-producto/modal-producto.component';
import { Producto } from '../../../../interfaces/producto';
import { ProductoService } from '../../../../services/producto.service';
import { UtilidadService } from '../../../../reutilizable/utilidad.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit, AfterViewInit{
  private dialog = inject(MatDialog);
  private productoService = inject(ProductoService);
  private utilidadService = inject(UtilidadService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  columnasTabla: string[] = ['nombre', 'categoria', 'stock', 'precio', 'estado', 'acciones'];
  dataInicio: Producto[] = [];
  dataListaProductos= new MatTableDataSource<Producto>(this.dataInicio);

  obtenerProductos(){
    this.productoService.lista().subscribe({
      next: (data) => {
        if (data.status == true){
          this.dataListaProductos.data = data.value;
        }
        else {this.utilidadService.mostrarAlerta('No se encontraron datos', 'Error')};
      },
      error: (error) => {
        console.log(error);;
      }
    })
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginator;
  }

  aplicarFiltro(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLowerCase();
  }

  nuevoProducto(){
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,
    }).afterClosed().subscribe(resultado => {
      if (resultado === 'true') this.obtenerProductos();
    });
  }

  editarProducto( producto: Producto){
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,
      data: producto
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerProductos();
    });
  }

  eliminarProducto(producto: Producto){
    Swal.fire({
      title: '¿Estas seguro de eliminar este producto?',
      text: producto.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Volver'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminar(producto.idProducto).subscribe({
          next: (data) => {
            if (data.status) {
              this.utilidadService.mostrarAlerta('Producto eliminado correctamente', 'Listo');
              this.obtenerProductos();
            } else this.utilidadService.mostrarAlerta('No se pudo eliminar el producto', 'Error');
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    })
  }






}
