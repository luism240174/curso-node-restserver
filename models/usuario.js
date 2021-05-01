const { Schema, model } = require('mongoose');

const usuarioSchema = Schema ({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],   
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true   
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']     
    },
    img: {
        type: String          
    },
    role: {
        type: String,
        required: true
        //enum: ['ADMIN_ROLE','USER_ROLE']   
    },
    estado: {
        type: Boolean,
        default: true          
    },
    google: {
        type: Boolean,
        default: false          
    }


});

//Usar funcion normal para utilizar el this
usuarioSchema.methods.toJSON = function () {
    //sacamos __v y password unicamente
    const { __v, password, ...usuario } = this.toObject();
    return usuario;
}

//mongoose agrega por defecto la s. 'Usuario'=>Usuarios = collection name 
module.exports = model('Usuario', usuarioSchema);
