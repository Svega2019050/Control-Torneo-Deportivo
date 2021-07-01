'use strict'

var jugadorModel = require("../models/jugador.mode");
var modelEquipo = require('../models/equipo.model');
var userModel = require("../models/user.model");

/* save */
function jugadorSave(req,res) {
    var equipoId = req.params.equipoId;
    var params = req.body;
    var jugador = new jugadorModel();

    modelEquipo.findById(equipoId,(err, findEquipo)=>{
        if (err) {
            return res.status(500).send({message: 'Error General',err});
        }else if(findEquipo) {
            if (params.nameJugador) {
                jugador.nameJugador = params.nameJugador;
                jugador.numberJugador = params.numberJugador;

                jugador.save((err,jugadorSaved)=>{
                    if (err) {
                        return res.status(500).send({message: 'Error General',err});
                    }else if(jugadorSaved) {
                        modelEquipo.findByIdAndUpdate(equipoId,{$push:{jugador:jugadorSaved._id}},{new: true},(err,jugadorPush)=>{
                            if (err) {
                                return res.status(500).send({message: 'Error General',err});
                            }else if(jugadorPush) {
                                return res.send({message: 'Jugador Guardado Con exito',jugadorPush});
                            } else {
                                return res.status(401).send({message: 'No se pudo Guardar Jugador'});
                            }
                        }).populate('jugador')
                    } else {
                        return res.status(401).send({message: 'Error Al Guardar Jugador'});
                    }
                });
            } else {
                return res.status(401).send({message: 'Porfavor ingrese los datos necesarios'});  
            }



        } else {
            return res.status(401).send({message: 'Equipo Inexistente'});  
        }
    });

}

/* Update */
function jugadorUpdate(req,res) {
    var jugadorId = req.params.jugadorId;
    var equipoId = req.params.equipoId;
    var update = req.body;

    jugadorModel.findById(jugadorId,(err, jugadorFind)=>{
        if (err) {
            return res.status(500).send({message: 'Error General',err});
        } else if(jugadorFind){
            modelEquipo.findOne({_id: equipoId, jugador: jugadorId},(err, equipoFind)=>{
                if (err) {
                    return res.status(500).send({message: 'Error General',err});
                } else if(equipoFind){
                    jugadorModel.findByIdAndUpdate(jugadorId, update, {new: true}, (err, equipoUpdate)=>{
                        if (err) {
                            return res.status(500).send({message: 'Error General'});
                        } else if(equipoUpdate){
                            return res.send({message: 'Jugador Actualizado Exitosamente',equipoUpdate});
                        }else{
                            return res.status(401).send({message: 'No se puedo actualizar el jugador'});
                        }
                    });
                }else{
                    return res.status(401).send({message: 'Equipo No existente'})
                }
            });
        }else{
            return res.status(401).send({message:'Jugador No Existe'});
        }
    });
}

/* Eliminar */
function jugadorEliminar(req,res) {
    var jugadorId = req.params.jugadorId;
    var equipoId = req.params.equipoId;

    modelEquipo.findByIdAndUpdate({_id: equipoId, jugador: jugadorId},
        {$pull:{jugador: jugadorId}},{new:true}, (err, jugadorPull)=>{
            if (err) {
                return res.status(500).send({message: 'Error General',err});
            } else if(jugadorPull){
                jugadorModel.findOne({_id: jugadorId},(err, jugadorFind)=>{
                    if (err) {
                        return res.status(500).send({message: ' Error General',err});
                    } else if (jugadorFind) {
                        jugadorModel.findByIdAndRemove(jugadorId, (err, jugadorRemoved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al eliminar'});
                            }else if(jugadorRemoved){
                                return res.send({message: 'Jugador eliminada', jugadorRemoved});
                            }else{
                                return res.status(403).send({message: 'Jugador no eliminada'});
                            }
                        });
                    }else {
                        return res.status(401).send({message: 'Jugador No Encontrada'});
                    }
                });
            }else{
                return res.status(401).send({message: 'No se pudo Eliminar'});
            }
    });


}


module.exports = {
    jugadorSave,
    jugadorEliminar,
    jugadorUpdate
}