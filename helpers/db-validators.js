
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
const Role = require('../models/role');
const Usuario = require('../models/usuario');



/*
*Usuarios
*/
const esRoleValido = async(role = '') => {
    const existRole = await Role.findOne({ role });
    if(!existRole){
        throw new Error(`El role ${ role } no esta registrado en la base de datos.`)
    }
}

const emailExiste = async(correo='') => {

    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error (`El correo ${ correo } ya existe en la base de datos.Por favor debe indicar otro.`)    
        };
    }

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (! existeUsuario ){
        throw new Error(`El id no existe ${id}`);
    }
}


/*
*Categorias
*/
const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ){
        throw new Error(`El id no existe ${id}`);
    }
}


/*
*Productos
*/
const existeProductoPorId = async (id) => {
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ){
        throw new Error(`El id no existe ${id}`);
    }
}



module.exports = { 
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}