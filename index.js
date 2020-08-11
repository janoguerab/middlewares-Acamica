const express = require("express");
const bodyParser = require("body-parser");
const server = express();

let contactos = [];

server.listen(3000, ()=>{
    console.log("Escuchando en http://localhost:3000")
});

//Middleware Log {Verbo} - {ruta} - {queryStrings} - {body}
function agregarLog(req, res, next){

    console.log(`${req.method} - ${req.path} - ${JSON.stringify(req.query)} - ${JSON.stringify(req.body)}`);
    next();
}

// validar usuario
// function validarUsuario(req, res, next) {
//     if(req.query.usuario !== "usuario"){
//         res.status(401).json("Usuario no encontrado!!")    
//     }else{
//         next();
//     }
// }


// function interceptar(req, res, next) {
//     console.log("Hola Mundo");
//     next();
// }
// server.get("/demo", interceptar,  (req, res)=>{
//     res.json(req.body);

// })

// Middleware - Validar Contacto
function validarContacto(req, res, next) {
    const { nombre, apellido, email } = req.body;

    if (!nombre || !apellido || !email) {
        res.status(400)
           .json("Falta información!!!");
    } else {
        next();
    }
}

// Middleware - Validar Contacto
function contactoExist(req, res, next) {
    const { nombre, apellido, email} = req.body;
    let exist = false;
    contactos.forEach((contacto)=>{
        if(contacto.nombre == nombre
            && contacto.apellido == apellido
            && contacto.email == email){
                exist = true;
            }
    })
    if (exist){
        res.status(409)
        .json("El contacto ya existe!!!");
    }else{
        next();
    } 
}

//Middleware QueryString Version > 5
function queryVersion(req, res, next){
    if(req.query.version){
        if(req.query.version > 5){
            next();
        }else{
            res.status(422).json("Version inferior!!!")
        }
    }else{
            res.status(401).json("Falta especificar la version")
    } 
}

// Middleware Errores genericos
function genericErros(err, req, res, next){
    console.log(err)
    if(err){
        res.status(500).json("Se ha producido un error inesperado.");
        console.log(`Error: ${err}`);
    }
}


//Para todas las rutas
server.use(bodyParser.json());
server.use(agregarLog);
server.use(genericErros);

// Middlewares to validate Contact
let validateContact = [validarContacto, contactoExist]
// POST - Crear un contacto
server.post("/contact",validateContact,(req, res)=>{
    contactos.push(req.body)
    res.status(200).json({
        'message':'Contacto agregado!!!', 
        contacto:req.body});   
});


// GET - Obtener todos los contactos
server.get("/demo",queryVersion, (req,res)=>{
    res.status(200).json(contactos);
});