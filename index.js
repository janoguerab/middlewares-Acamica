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

//Para todas las rutas
server.use(bodyParser.json());
server.use(agregarLog);



// GET - Obtener todos los contactos
server.get("/demo", (req,res)=>{
    res.status(200).json(contactos);
});

// Middleware - Validar Contacto
function validarContacto(req, res, next) {
    const { nombre, apellido } = req.body;
    if (!nombre || !apellido) {
        res.status(400)
           .json("Falta información!!!");
    } else {
        next();
    }
}


// POST - Crear un contacto
server.post("/contacto",validarContacto,(req, res)=>{
    contactos.push(req.body)
    res.json('Contacto agregado!!!');   
});

