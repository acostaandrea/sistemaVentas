using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using SistemaVenta.DTO;
using SistemaVenta.Model;

namespace SistemaVenta.Utility
{
    public class AutoMapperProfile: Profile
    {
        public AutoMapperProfile()
        {
            #region Rol
            CreateMap<Rol, RolDto>().ReverseMap();
            #endregion
            #region Menu
            CreateMap<Menu, MenuDto>().ReverseMap();
            #endregion
            #region Usuario
            CreateMap<Usuario, UsuarioDto>()
                .ForMember(dest => dest.RolDescripcion, opt => opt.MapFrom(src => src.IdRolNavigation.Nombre))
                .ForMember(dest => dest.EsActivo, opt => opt.MapFrom(src => src.EsActivo == true ? 1 : 0));

            CreateMap<Usuario, SesionDto>()
                .ForMember(dest => dest.RolDescripcion, opt => opt.MapFrom(src => src.IdRolNavigation.Nombre));

            CreateMap<UsuarioDto, Usuario>()
                .ForMember(dest => dest.IdRolNavigation, opt => opt.Ignore())
                .ForMember(dest => dest.EsActivo, opt => opt.MapFrom(src => src.EsActivo == 1 ? true : false));


            #endregion
            #region Categoria
            CreateMap<Categoria, CategoriaDto>().ReverseMap();
            #endregion
            #region Producto
            CreateMap<Producto, ProductoDto>()
                .ForMember(dest => dest.DescripcionCategoria, opt => opt.MapFrom(src => src.IdCategoriaNavigation.Nombre))
                .ForMember(dest => dest.Precio, opt => opt.MapFrom(src => Convert.ToString(src.Precio.Value, new CultureInfo("es-AR"))))
                .ForMember(dest => dest.EsActivo, opt => opt.MapFrom(src => src.EsActivo == true ? 1 : 0));
            CreateMap<ProductoDto, Producto>()
                .ForMember(dest => dest.IdCategoriaNavigation, opt => opt.Ignore())
                .ForMember(dest => dest.Precio, opt => opt.MapFrom(src => Convert.ToDecimal(src.Precio, new CultureInfo("es-AR"))))
                .ForMember(dest => dest.EsActivo, opt => opt.MapFrom(src => src.EsActivo == 1 ? true : false));

            
            #endregion
            #region Venta
            CreateMap<Venta, VentaDto>()
                .ForMember(dest => dest.TotalTexto, opt => opt.MapFrom(src => Convert.ToString(src.Total.Value, new CultureInfo("es-AR"))))
                .ForMember(dest => dest.FechaRegistro, opt => opt.MapFrom(src => src.FechaRegistro.Value.ToString("dd/MM/yyyy")));
            CreateMap<VentaDto, Venta>()
                .ForMember(dest => dest.Total, opt => opt.MapFrom(src => Convert.ToDecimal(src.TotalTexto, new CultureInfo("es-AR"))));                
            #endregion
            #region DetalleVenta
            CreateMap<DetalleVenta, DetalleVentaDto>()
                .ForMember(dest => dest.PrecioTexto, opt => opt.MapFrom(src => Convert.ToString(src.Precio.Value, new CultureInfo("es-AR"))))
                .ForMember(dest => dest.TotalTexto, opt => opt.MapFrom(src => Convert.ToString(src.Total.Value, new CultureInfo("es-AR"))))
                .ForMember(dest => dest.DescripcionProducto, opt => opt.MapFrom(src => src.IdProductoNavigation.Nombre));
            CreateMap<DetalleVentaDto, DetalleVenta>()
                .ForMember(dest => dest.Precio, opt => opt.MapFrom(src => Convert.ToDecimal(src.PrecioTexto, new CultureInfo("es-AR"))))
                .ForMember(dest => dest.Total, opt => opt.MapFrom(src => Convert.ToDecimal(src.TotalTexto, new CultureInfo("es-AR"))));
            #endregion
            #region Reporte
            CreateMap<DetalleVenta, ReporteDto>()
                .ForMember(dest => dest.FechaRegistro, opt => opt.MapFrom(src => src.IdVentaNavigation.FechaRegistro.Value.ToString("dd/MM/yyyy")))
                .ForMember(dest => dest.NumeroDocumento, opt => opt.MapFrom(src => src.IdVentaNavigation.NumeroDocumento))
                .ForMember(dest => dest.TipoPago, opt => opt.MapFrom(src => src.IdVentaNavigation.TipoPago))
                .ForMember(dest => dest.TotalVenta, opt => opt.MapFrom(src => Convert.ToString(src.IdVentaNavigation.Total.Value, new CultureInfo("es-AR"))))
                .ForMember(dest => dest.Producto, opt => opt.MapFrom(src => src.IdProductoNavigation.Nombre))
                .ForMember(dest => dest.Precio, opt => opt.MapFrom(src => Convert.ToString(src.Precio.Value, new CultureInfo("es-AR"))))
                .ForMember(dest => dest.Total, opt => opt.MapFrom(src => Convert.ToString(src.Total.Value, new CultureInfo("es-AR"))));
            #endregion
        }
    }
}
