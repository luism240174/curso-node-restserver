const { Router, request, response } = require('express');
const { check } = require('express-validator');

const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const validarArchivoSubir = require('../middlewares/validar-archivo');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/:coleccion/:id', [
    check('id', 'El id deber ser un id de MONGO').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas ( c, ['usuarios','productos'] )),
    validarCampos
], mostrarImagen);

router.post('/', validarArchivoSubir, cargarArchivo );

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id deber ser un id de MONGO').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas ( c, ['usuarios','productos'] )),
    validarCampos
], actualizarImagenCloudinary )



module.exports = router;