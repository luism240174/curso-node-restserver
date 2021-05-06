const { request, response } = require("express");
const Categoria = require("../models/categoria");


//Obtener categorias - paginado - total - populate
const obtenerCategorias = async (req=request, res=response) => {
    /*
    req.query = await Categoria.find();
    const categorias = req.query;
    res.json({
        categorias
    });
    */
    
    const { limite=5, desde=0 } = req.query;
    const query = { estado:true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number( desde ))
            .limit(Number( limite))
    ]);

    res.json({
        total,
        categorias
    });

}

//Obtener categoria - populate {}

const obtenerCategoriaPorId = async ( req = request, res = response ) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.json({
        msg: 'Categoria: ',
        categoria
    })

}


const crearCategoria = async (req = request, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB} ya existe`
        });
    }
    
    //Generar la data a guardar
    const data = {
    nombre,
    usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar en BD
    await categoria.save();

    res.status(201).json(categoria);

}


//Actualizar Categoria
const actualizarCategoria = async (req=request, res=response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json({
        categoria
    });
}


//Borrar Categoria - estado : false
const borrarCategoria = async (req=request, res=response) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        categoria
    })


}



module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    borrarCategoria
}