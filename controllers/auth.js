const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { validationResult } = require('express-validator');
const generarJWT = require('../helpers/generar-jwt');


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - correo'
            })
        }
        //Verificar si el usuario esta activo
        if( usuario.estado === false ){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - estado:false'
            })
        }
        //Verificar la contrase#a
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (validPassword===false){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - password'
            })
        }
        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json ({
            msg: 'login ok',
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg:'Comuníquese con el administrador'
        })
    }
    
}


module.exports = {
    login
}