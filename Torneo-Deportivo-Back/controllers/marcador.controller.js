'use strict'

var marcadorModel = require("../models/marcador.model");
var torneoModel = require("../models/torneo.model");
var equipoModel = require("../models/equipo.model");
var userModel = require("../models/user.model");
const { count } = require("../models/marcador.model");

/* Save Marcador */
function marcadorSave (req, res) {
    var userId = req.params.userId;
    var torneoId = req.params.torneoId;
    var params = req.body;
    var marcador = new marcadorModel();

    if (userId != req.user.sub) {
        return res.status(401).send({message: 'No tiene permiso para realizar esta acción '});
    }else{
        if (params.jornada && params.equipo1 && params.golEquipo1 && params.equipo2 && params.golEquipo2) {
            torneoModel.findById(torneoId,{torneo : torneoId},(err, torneoFind)=>{
                if (err) {
                    return res.status(500).send({message: 'Error General',err});
                }else if(torneoFind) {
                    VerificarEquipo(params.equipo1, params.equipo2, (err) =>{
                        if (err) {
                            return res.status(500).send({message: 'Error General',err});
                        }else {
                            
                            if (params.equipo1 == params.equipo2) {
                                return res.status(401).send({message: 'El mismo equipo no puede tener marcador'});
                            }else{
                                marcador.jornada = params.jornada,
                                marcador.equipo1 = params.equipo1,
                                marcador.golEquipo1 = params.golEquipo1,
                                marcador.equipo2 = params.equipo2,
                                marcador.golEquipo2 = params.golEquipo2
            
                                marcador.save((err, saveMarcador)=>{
                                    if (err) {
                                        return res.status(500).send({message: 'Error General',err});
                                    }else if(saveMarcador) {
                                        torneoModel.findByIdAndUpdate(torneoId,{$push:{marcador:saveMarcador._id}},{new: true},(err, marcadorPush)=>{
                                            if (err) {
                                                return res.status(500).send({message: 'Error General',err});
                                            }else if(marcadorPush) {
                                                return res.send({message: 'Marcador Guardado Con Exito',marcadorPush});
                                            } else {
                                                return res.status(401).send({message: 'NO se Puede Guardar Marcador'});
                                            }
                                        })
                                    } else {
                                        return res.status(401).send({message: 'Error al guardar Marcador'});
                                    }
                                });
                            }
                            
                        }
                    });
                } else {
                    return res.status(401).send({message: 'Torneo Inexisten'});
                }
            });
        } else {
            return res.status(401).send({message: 'Faltan datos'});
        }
    }

}

/* Update marcador */
function marcadorUpdate(req, res) {
    
}
/* Delete marcador */
function marcadorDelete(req,res) {
    
}

/* Verificacion */
function VerificarEquipo(equipo1, equipo2,callback) {
    var equipoUno;
    var equipoDos;

    equipoModel.findById(equipo1, (err, equipoUnoVery) => {
        if(err){
            callback("Error general con el equipo 1");
        }else if(equipoUnoVery){
            equipoModel.findById(equipo2, (err, equipoDosVery) => {
                if(err){
                    callback("Error general con el equipo 2");
                }else if(equipoDosVery){
                    equipoUno = equipo1.torneoModel;
                    equipoDos = equipo2.torneoModel;

                    if(equipoUno == equipoDos ){
                        callback(false);
                    }else{
                        callback("Los equipos no pertenecen a la misma liga");
                    }

                }else{
                    callback("El equipo número dos no existe");
                }
            });
        }else{
            callback("El equipo número uno no existe");
        }
    });


}

function VerificarJornada(numero, torneo, callback){
    equipoModel.find({torneo : torneo}, (err, equipos) => {
        if(err){
            callback("Error General de verificacion de Jornada");
        }else{
            if(numero < equipos.length){
                callback(false);
            }else{
                callback("No se puede agregar jornada mas alta de la que se permite");
            }
        }
    });
}

function getMarcador(req, res) {
    var torneoId = req.params.torneoId;
    var userId = req.params.userId;

    
    marcadorModel.find({}).exec((err, marcador) => {
        if (err) {
            return res.status(500).send({ message: 'Error general en el servidor' })
        } else if (marcador) {
            return res.send({ message: 'Marcador',marcador })
        } else {
            return res.status(404).send({ message: 'No hay Marcador' })
        }
    })

    
}

/* Exports */
module.exports = {
    marcadorSave,
    marcadorUpdate,
    marcadorDelete,
    getMarcador
}