const { Router, response } = require('express');
const { check } = require('express-validator');

const { 
    crearCategoria, 
    obtenerCategoriaPorId,
    obtenerCategorias,
    actualizarCategoria, 
    borrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

//{{url}}/api/categorias

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);
    

//Obtener categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],
obtenerCategoriaPorId );

//Crear categoria - privado - cualquier persona con un token valido
//Mandar el token en el header. key: x-token value:token del logueo
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );

//Actualizar - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],actualizarCategoria );


//Borrar un categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria );


module.exports = router;