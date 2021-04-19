const { response, request } = require('express');

const usuariosGet = (req = request, res = response ) => {
    
    const { q, nombre="No name", apikey, page= 1, limit=5 } = req.query;
    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    }); 
}

const usuariosPost = (req, res) => {
    const { nombre, edad } = req.body;

    res.status(201).json({
        msg: 'post API - usuariosPost',
        nombre, 
        edad
        }); 
    }

const usuariosPut = (req, res) => {
    const { id } = req.params;

    res.json({
        msg: 'put API - usuariosPut',
        id
        }); 
    }

const usuariosPatch = (req, res) => {
    res.status(500).json({
            msg: 'patch API'
            }); 
        }
    
const usuariosDelete = (req, res) => {
    res.json ({
        msg: 'delete API'
        }); 
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}