const { request, response } = require("express");


const esAdminRole = (req = request, res = response, next) => {
    //req.usuario viene de la validar-jwt
    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { role, nombre } = req.usuario;
    if ( role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No tiene autorización requerida`
        })
    }

    next();
}

const tieneRole = ( ...roles ) => {

    return (req=request, res=response, next) => {
        console.log(roles);
        if( !req.usuario ){
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }
        if( !roles.includes( req.usuario.role)){
            return res.status(401).json({
                msg: `La acción requiere uno de estos roles ${roles}`
            })   
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
};
