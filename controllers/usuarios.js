const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { find } = require('../models/usuario');


const usuariosGet = async (req = request, res = response ) => {
    
    //const { q, nombre="No name", apikey, page= 1, limit=5 } = req.query;
    const { limite=5, desde=0 } = req.query;
    const query = { estado: true };

    //const usuarios = await Usuario.find(query)
      //  .skip(Number(desde))
      //  .limit(Number(limite))

    //const total = await Usuario.countDocuments(query);

    //Promise.all() ejecuta las 2 de manera simultanea
    const [ total, usuarios ] = await Promise.all([
        Usuario.count(query),
        Usuario.find(query)
            .skip(Number( desde ))
            .limit(Number( limite ))
    ]);
    res.json({
        
        total, 
        usuarios
    }); 
}

const usuariosPost = async (req, res) => {
 
    /*
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }
    */

    const { nombre, correo, password, role } = req.body;
    const usuario = new Usuario({ nombre, correo, password, role });
    
    //Verificar si el correo existe
    /*
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        return res.status(400).json({
            msg: 'La dirección de correo ya existe'
        });
    }
    */
    //Encriptar contrasena
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en base de datos
    usuario.save();    

    res.json({
        usuario
    });

}

const usuariosPut = async (req, res) => {
    const { id } = req.params;
    //Desconstruyo y descarto password y google
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar contra base de datos
    if ( password ) {
        //Encriptar contrasena
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }
    const usuario = await Usuario.findByIdAndUpdate( id, resto )

    res.json({
        msg: 'put API - usuariosPut',
        usuario
        }); 
    }

const usuariosPatch = (req, res) => {
    res.status(500).json({
            msg: 'patch API'
            }); 
        }
    
const usuariosDelete = async (req, res) => {

    const { id } = req.params;

    //ALTERNATIVA A: Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    //ALTERNATIVA B: Cambiamos el estado del usuario
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    
    res.json ({
        msg: 'delete API',
        usuario
        }); 
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}