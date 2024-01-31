using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.DTO;
using SistemaVenta.Model;
using Microsoft.EntityFrameworkCore;

namespace SistemaVenta.BLL.Servicios
{
    public class ProductoService : IProductoService
    {
        private readonly IGenericRepository<Producto> _productoRepository;
        private readonly IMapper _mapper;

        public ProductoService(IGenericRepository<Producto> productoRepository, IMapper mapper)
        {
            _productoRepository = productoRepository;
            _mapper = mapper;
        }

        public async Task<List<ProductoDto>> Lista()
        {
            try 
            {
                var queryProducto =await _productoRepository.Consultar();
                var listaProducto = queryProducto.Include(categoria => categoria.IdCategoriaNavigation).ToList();
                return _mapper.Map<List<ProductoDto>>(listaProducto);
            }
            catch 
            {
                throw;
            }
        }

        public async Task<ProductoDto> Crear(ProductoDto modelo)
        {
            try
            {
                var productoCreado =await _productoRepository.Crear(_mapper.Map<Producto>(modelo));
                if(productoCreado.IdProducto == 0) throw new TaskCanceledException("No se pudo crear el producto");
                return _mapper.Map<ProductoDto>(productoCreado);
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Editar(ProductoDto modelo)
        {
            try
            {
                var productoModelo = _mapper.Map<Producto>(modelo);
                var productoEncontrado = await _productoRepository.Obtener(u => u.IdProducto == productoModelo.IdProducto);
                if(productoEncontrado == null) throw new TaskCanceledException("No se encontro el producto");
                productoEncontrado.Nombre = productoModelo.Nombre;
                productoEncontrado.Precio = productoModelo.Precio;
                productoEncontrado.IdCategoria = productoModelo.IdCategoria;
                productoEncontrado.Stock = productoModelo.Stock;
                productoEncontrado.EsActivo = productoModelo.EsActivo;

                bool respuesta = await _productoRepository.Editar(productoEncontrado);
                if (!respuesta) throw new TaskCanceledException("No se pudo editar");
                return respuesta;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Eliminar(int id)
        {
            try
            {
                var productoEncontrado = await _productoRepository.Obtener(u => u.IdProducto == id);
                if (productoEncontrado == null) throw new TaskCanceledException("No se encontro el producto");
                bool respuesta = await _productoRepository.Eliminar(productoEncontrado);
                if (!respuesta) throw new TaskCanceledException("No se pudo eliminar");
                return respuesta;
            }
            catch
            {
                throw;
            }
        }

        
    }
}
