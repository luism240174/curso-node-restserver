const { Router, request } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
//const { validarCampos } = require('../middlewares/validar-campos');
//const { validarJWT } = require('../middlewares/validar-jwt');
//const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const { 
    validarCampos, 
    validarJWT, 
    esAdminRole,
    tieneRole
} = require('../middlewares');

const router = Router();

router.get('/', usuariosGet);

router.post('/',[ 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener más de 6 letras').isLength({ min:6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    //check('role', 'No es un role válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('role').custom( esRoleValido ),
    
    validarCampos
] , usuariosPost);

router.put('/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeUsuarioPorId),
    check('role').custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch );

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeUsuarioPorId),
    validarCampos
],usuariosDelete);








module.exports = router;