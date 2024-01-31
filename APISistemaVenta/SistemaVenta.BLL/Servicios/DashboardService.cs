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
    public class DashboardService : IDashboardService
    {
        private readonly IGenericRepository<Producto> _productoRepository;
        private readonly IVentaRepository _ventaRepository;
        private readonly IMapper _mapper;

        public DashboardService(IGenericRepository<Producto> productoRepository, IVentaRepository ventaRepository, IMapper mapper)
        {
            _productoRepository = productoRepository;
            _ventaRepository = ventaRepository;
            _mapper = mapper;
        }

        private IQueryable<Venta> retornarVentas(IQueryable<Venta> tablaVenta, int restarCantidadDias)
        {
            DateTime? ultimaFecha = tablaVenta.OrderByDescending(x => x.FechaRegistro).Select(x => x.FechaRegistro).First();
            ultimaFecha = ultimaFecha.Value.AddDays(restarCantidadDias);
            return tablaVenta.Where(x => x.FechaRegistro >= ultimaFecha.Value.Date);
        }

        private async Task<int> TotalVentasUltimaSemana()
        {
            int total = 0;
            IQueryable<Venta> _ventaQuery = await _ventaRepository.Consultar();
            if (_ventaQuery.Count() > 0)
            {
                var tablaVenta = retornarVentas(_ventaQuery, -7);
                total = tablaVenta.Count();
            }
            return total;
        }

        private async Task<string> TotalIngresosUltimaSemana()
        {
            decimal resultado = 0;
            IQueryable<Venta> _ventaQuery = await _ventaRepository.Consultar();
            if (_ventaQuery.Count() > 0)
            {
                var tablaVenta = retornarVentas(_ventaQuery, -7);
                resultado = tablaVenta.Select(x => x.Total).Sum(v => v.Value);
            }
            return Convert.ToString(resultado, new CultureInfo("es-AR"));
        }

        private async Task<int> TotalProductos()
        {
            IQueryable<Producto> _productoQuery = await _productoRepository.Consultar();
            int total = _productoQuery.Count();
            return total;
        }

        private async Task<Dictionary<string,int>> VentasUltimaSemana()
        {
            Dictionary<string, int> resultado = new Dictionary<string, int>();
            IQueryable<Venta> _ventaQuery = await _ventaRepository.Consultar();
            if (_ventaQuery.Count() > 0)
            {
                var tablaVenta = retornarVentas(_ventaQuery, -7);
                resultado = tablaVenta.GroupBy(x => x.FechaRegistro.Value.Date).OrderBy(g=> g.Key)
                    .Select(dv => new
                    {
                        fecha = dv.Key.ToString("dd/MM/yyyy"),
                        total = dv.Count()
                        }).ToDictionary(x => x.fecha, x => x.total);
                    
            }
            return resultado;
        }

        public async Task<DashboardDto> Resumen()
        {
            DashboardDto vmDashboard = new DashboardDto();
            try 
            {   
               vmDashboard.TotalVentas = await TotalVentasUltimaSemana();
               vmDashboard.TotalIngresos = await TotalIngresosUltimaSemana();
               vmDashboard.TotalProductos = await TotalProductos();
                List<VentaSemanaDto> listaVenta = new List<VentaSemanaDto>();
                foreach (KeyValuePair<string,int> item in await VentasUltimaSemana())
                {
                    listaVenta.Add(new VentaSemanaDto { Fecha = item.Key, Total = item.Value });
                }
               vmDashboard.VentasUltimaSemana = listaVenta;
             }
            catch
            {
                throw;
            }
            return vmDashboard;
        }
    }
}
