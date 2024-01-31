using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.DTO;

namespace SistemaVenta.BLL.Servicios.Contrato
{
    public interface IVentaService
    {

        Task<VentaDto> Registrar(VentaDto modelo);
        Task<List<VentaDto>> Historial(string buscarPor, string numeroVenta, string fechaInicio, string fechaFin);
        Task<List<ReporteDto>> Reporte(string fechaInicio, string fechaFin);
    }
}
