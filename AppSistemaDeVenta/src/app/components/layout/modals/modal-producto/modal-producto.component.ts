import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from '../../../../interfaces/producto';
import { Categoria } from '../../../../interfaces/categoria';
import { ProductoService } from '../../../../services/producto.service';
import { CategoriaService } from '../../../../services/categoria.service';
import { UtilidadService } from '../../../../reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.css'
})
export class ModalProductoComponent {

  private modalActual = inject(MatDialogRef<ModalProductoComponent>);
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private utilidadService = inject(UtilidadService);

  formulario: FormGroup;
  ocultarPassword = true;
  tituloAccion: string = 'Agregar'
  botonAccion: string = 'Guardar'
  listaCategorias: Categoria[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public datosProducto: Producto) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', [Validators.required]],
      stock: ['', Validators.required],
      precio: ['', Validators.required],
      esActivo: ['1', Validators.required]
    });
    if (this.datosProducto != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
    this.categoriaService.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaCategorias = data.value;
      },
      error: (error) => {
        console.log(error);;
      }
    })
  }

  ngOnInit(): void {
    if (this.datosProducto != null) {
      this.formulario.patchValue({
        nombre: this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString()
      });
    }
  }

  guardarEditar_Producto() {
      const producto: Producto = {
        idProducto: this.datosProducto == null ? 0 : this.datosProducto.idProducto,
        nombre: this.formulario.value.nombre,
        idCategoria: this.formulario.value.idCategoria,
        descripcionCategoria: '',
        stock: this.formulario.value.stock,
        precio: this.formulario.value.precio,
        esActivo: parseInt(this.formulario.value.esActivo)
      }
      if (this.datosProducto == null) {
        this.productoService.guardar(producto).subscribe({
          next: (data) => {
            if (data.status) {
              this.utilidadService.mostrarAlerta('Producto agregado correctamente', 'Éxito');
              this.modalActual.close("true");
            }
          },
          error: (error) => {
            this.utilidadService.mostrarAlerta('Error al agregar producto', 'Error');
          }
        })
      } else {
        this.productoService.editar(producto).subscribe({
          next: (data) => {
            if (data.status) {
              this.utilidadService.mostrarAlerta('Producto editado correctamente', 'Éxito');
              this.modalActual.close("true");
            }
          },
          error: (error) => {
            this.utilidadService.mostrarAlerta('Error al editar producto', 'Error');
          }
        })

    }
  }

}
