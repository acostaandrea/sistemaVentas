﻿using System;
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
    public class UsuarioService : IUsuarioService
    {
        private readonly IGenericRepository<Usuario> _usuarioRepository;
        private readonly IMapper _mapper;

        public UsuarioService(IGenericRepository<Usuario> usuarioRepository, IMapper mapper)
        {
            _usuarioRepository = usuarioRepository;
            _mapper = mapper;
        }


        public async Task<List<UsuarioDto>> Lista()
        {
            try
            {
                var queryUsuario = await _usuarioRepository.Consultar();
                var listaUsuario = queryUsuario.Include(rol => rol.IdRolNavigation).ToList();
                return _mapper.Map<List<UsuarioDto>>(listaUsuario);

            }catch 
            {

                throw;
            }
        }

        public async Task<SesionDto> ValidarCredenciales(string correo, string clave)
        {
            try
            {
                var queryUsuario =await  _usuarioRepository.Consultar(c => c.Correo == correo && c.Clave == clave);
                if(queryUsuario.FirstOrDefault() == null) throw new TaskCanceledException("Usuario no existe");
                Usuario devolverUsuario = queryUsuario.Include(rol => rol.IdRolNavigation).First();
                return _mapper.Map<SesionDto>(devolverUsuario);

            }
            catch
            {

                throw;
            }
        }

        public async Task<UsuarioDto> Crear(UsuarioDto modelo)
        {
            try
            {
                
                var usuarioCreado  = await _usuarioRepository.Crear(_mapper.Map<Usuario>(modelo));
                if(usuarioCreado.IdUsuario == 0) throw new TaskCanceledException("No se pudo crear");
                var query = await _usuarioRepository.Consultar(c => c.IdUsuario == usuarioCreado.IdUsuario);
                usuarioCreado = query.Include(rol => rol.IdRolNavigation).First();
                return _mapper.Map<UsuarioDto>(usuarioCreado);
            }
            catch
            {

                throw;
            }
        }

        public async Task<bool> Editar(UsuarioDto modelo)
        {
            try
            {
                var usuarioModelo = _mapper.Map<Usuario>(modelo);
                var usuarioEncontrado = await _usuarioRepository.Obtener(u => u.IdUsuario == usuarioModelo.IdUsuario);
                if (usuarioEncontrado == null) throw new TaskCanceledException("Usuario no existe");
                usuarioEncontrado.NombreCompleto = usuarioModelo.NombreCompleto;
                usuarioEncontrado.Correo = usuarioModelo.Correo;
                usuarioEncontrado.IdRol = usuarioModelo.IdRol;
                usuarioEncontrado.Clave = usuarioModelo.Clave;
                usuarioEncontrado.EsActivo = usuarioModelo.EsActivo;

                bool respuesta = await _usuarioRepository.Editar(usuarioEncontrado);
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
                var usuarioEncontrado =  await _usuarioRepository.Obtener(u => u.IdUsuario == id);
                if (usuarioEncontrado == null) throw new TaskCanceledException("Usuario no existe");
                bool respuesta = await _usuarioRepository.Eliminar(usuarioEncontrado);
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
