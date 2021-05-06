const { Router } = require('express');
const { check } = require('express-validator');

const { 
    validarJWT,
    validarCampos,
    esAdminRole
 } = require('../middlewares')

const { 
    existeProductoPorId,
    existeCategoriaPorId
 } = require('../helpers/db-validators');

const { 
    obtenerProductos, 
    obtenerProductoPorId, 
    crearProducto,
    actualizarProducto,
    borrarProducto
 } = require('../controllers/productos');

const router = Router();



//Obtener todos los productos - PUBLICO
router.get('/', obtenerProductos);
    

//Obtener producto por id - PUBLICO
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],
obtenerProductoPorId );

//Crear producto - PRIVADO - cualquier persona con un token valido
//Mandar el token en el header. key: x-token value:token del logueo
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de MONGO').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto );

//Actualizar producto - PRIVADO - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    //check('categoria', 'No es un id de MONGO').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],actualizarProducto );


//Borrar un producto - PRIVADO - solo ADMIN_ROLE
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto );


module.exports = router;