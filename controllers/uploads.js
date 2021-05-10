
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models');



const cargarArchivo = async (req=request , res=response) => {
    /*
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json('No hay archivos para subir.');
        return;
    }
    */

   try {
        //solo tipos de archivos by default y creacion de la carpeta imgs
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );    
        res.json({ nombre });  

   } catch (msg) {
       res.status(400).json({
           msg
       });
   }   
}

const actualizarImagen = async (req=request, res=response) => {
    
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});           
    }


    // Limpiar img previas
    if (modelo.img) {
        //Borrar la img
        const imgPath = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if( fs.existsSync( imgPath ) ){
            fs.unlinkSync( imgPath );
        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre;

    await modelo.save();

    res.json( modelo );
}


const actualizarImagenCloudinary = async (req=request, res=response) => {
    
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});           
    }


    // Limpiar img previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length -1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);

    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.img = secure_url;

    await modelo.save();

    res.json( modelo );
}


const mostrarImagen = async (req=request, res=response) => {

    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});           
    }


    if (modelo.img) {

        const imgPath = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if( fs.existsSync( imgPath ) ){
            return res.sendFile(imgPath);
        }
    }

    const imgPath = path.join( __dirname, '../assets/no-image.jpg' );
    res.sendFile(imgPath);
    
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}