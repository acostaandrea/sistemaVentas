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
using System.Linq.Expressions;
using System.Globalization;
using Microsoft.EntityFrameworkCore;

namespace SistemaVenta.BLL.Servicios
{
    public class VentaService : IVentaService
    {

        private readonly IGenericRepository<DetalleVenta> _detalleventaRepository;
        private readonly IVentaRepository _ventaRepository;
        private readonly IMapper _mapper;

        public VentaService(IGenericRepository<DetalleVenta> detalleventaRepository, IVentaRepository ventaRepository, IMapper mapper)
        {
            _detalleventaRepository = detalleventaRepository;
            _ventaRepository = ventaRepository;
            _mapper = mapper;
        }

        public async Task<VentaDto> Registrar(VentaDto modelo)
        {
            try
            {
                var ventaGenerada = await _ventaRepository.Registrar(_mapper.Map<Venta>(modelo));
                if (ventaGenerada.IdVenta == 0) throw new TaskCanceledException("No se pudo registrar la venta");
                return _mapper.Map<VentaDto>(ventaGenerada);
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<VentaDto>> Historial(string buscarPor, string numeroVenta, string fechaInicio, string fechaFin)
        {
            IQueryable<Venta> query = await _ventaRepository.Consultar();
            var listaVenta = new List<Venta>();
            try
            {
                if(buscarPor == "fecha")
                {
                    DateTime fechInicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", new CultureInfo("es-AR"));
                    DateTime fechFin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", new CultureInfo("es-AR"));
                    listaVenta = await query.Where(x => x.FechaRegistro.Value.Date >= fechInicio.Date && x.FechaRegistro.Value.Date <= fechFin).Include(dv => dv.DetalleVenta).ThenInclude(p=> p.IdProductoNavigation).ToListAsync();

                }
                else
                {
                    listaVenta = await query.Where(x => x.NumeroDocumento == numeroVenta).Include(dv => dv.DetalleVenta).ThenInclude(p => p.IdProductoNavigation).ToListAsync();

                }
            }
            catch
            {
                throw;
            }
            return _mapper.Map<List<VentaDto>>(listaVenta);
        }

        

        public async Task<List<ReporteDto>> Reporte(string fechaInicio, string fechaFin)
        {
            IQueryable<DetalleVenta> query = await _detalleventaRepository.Consultar();
            var listaResultado = new List<DetalleVenta>();
            try
            {
                DateTime fechInicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", new CultureInfo("es-AR"));
                DateTime fechFin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", new CultureInfo("es-AR"));
                listaResultado = await query.Include(p => p.IdProductoNavigation).Include(v => v.IdVentaNavigation)
                    .Where(
                    dv => dv.IdVentaNavigation.FechaRegistro.Value.Date >= fechInicio.Date &&
                    dv.IdVentaNavigation.FechaRegistro.Value.Date <= fechFin.Date
                    )
                    .ToListAsync();
            }
            catch
            {
                throw;
            }
            return _mapper.Map<List<ReporteDto>>(listaResultado);
        }
    }
}
