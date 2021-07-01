'use strict'

var modelEquipo = require('../models/equipo.model');
var torneoModel = require("../models/torneo.model");
var userModel = require("../models/user.model");

/* save */
function equipoSave(req,res) {
    var torneoId = req.params.torneoId;
    var params = req.body;
    var equipo = new modelEquipo();

    torneoModel.findById(torneoId,(err, findTorneo)=>{
        if (err) {
            return res.status(500).send({message: 'Error General',err});
        }else if(findTorneo) {
            if (params.nameEquipo) {
                equipo.nameEquipo = params.nameEquipo.toLowerCase();

                equipo.save((err,equipoSaved)=>{
                    if (err) {
                        return res.status(500).send({message: 'Error General',err});
                    }else if(equipoSaved) {
                        torneoModel.findByIdAndUpdate(torneoId,{$push:{equipo:equipoSaved._id}},{new: true},(err,equipoPush)=>{
                            if (err) {
                                return res.status(500).send({message: 'Error General',err});
                            }else if(equipoPush) {
                                return res.send({message: 'Equipo Guardado Con exito',equipoPush});
                            } else {
                                return res.status(401).send({message: 'No se pudo Guardar Equipo'});
                            }
                        }).populate('equipo')
                    } else {
                        return res.status(401).send({message: 'Error Al Guardar Equipo'});
                    }
                });
            } else {
                return res.status(401).send({message: 'Porfavor ingrese los datos necesarios'});  
            }



        } else {
            return res.status(401).send({message: 'Torneo Inexistente'});  
        }
    });

}

/* Update */
function equipoUpdate(req,res) {
    var torneoId = req.params.torneoId;
    var equipoId = req.params.equipoId;
    var update = req.body;

    if (update.nameEquipo) {
        modelEquipo.findById(equipoId,(err, equipoFind)=>{
            if (err) {
                return res.status(500).send({message: 'Error General',err});
            } else if(equipoFind){
                torneoModel.findOne({_id: torneoId, equipo: equipoId},(err, torneoFind)=>{
                    if (err) {
                        return res.status(500).send({message: 'Error General',err});
                    } else if(torneoFind){
                        modelEquipo.findByIdAndUpdate(equipoId, update, {new: true}, (err, equipoUpdate)=>{
                            if (err) {
                                return res.status(500).send({message: 'Error General'});
                            } else if(equipoUpdate){
                                return res.send({message: 'Equipo Actualizado Exitosamente',equipoUpdate});
                            }else{
                                return res.status(401).send({message: 'No se puedo actualizar el Equipo'});
                            }
                        });
                    }else{
                        return res.status(401).send({message: 'Torneo No existente'})
                    }
                });
            }else{
                return res.status(401).send({message:'Equipo No Existe'});
            }
        });
    } else {
        return res.status(401).send({message:'por favor ingrese todo los datos necesarios'});
    }
}

/* Eliminar */
function equipoEliminar(req,res) {
    var torneoId = req.params.torneoId;
    var equipoId = req.params.equipoId;

    torneoModel.findByIdAndUpdate({_id: torneoId, equipo: equipoId},
        {$pull:{equipo: equipoId}},{new:true}, (err, equipoPull)=>{
            if (err) {
                return res.status(500).send({message: 'Error General',err});
            } else if(equipoPull){
                modelEquipo.findOne({_id: equipoId},(err, equipoFind)=>{
                    if (err) {
                        return res.status(500).send({message: ' Error General',err});
                    } else if (equipoFind) {
                        modelEquipo.findByIdAndRemove(equipoId, (err, equipoRemoved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al eliminar'});
                            }else if(equipoRemoved){
                                return res.send({message: 'Equipo eliminada', equipoRemoved});
                            }else{
                                return res.status(403).send({message: 'Equipo no eliminada'});
                            }
                        });
                    }else {
                        return res.status(401).send({message: 'Equipo No Encontrada'});
                    }
                });
            }else{
                return res.status(401).send({message: 'No se pudo Eliminar'});
            }
    });


}


module.exports = {
    equipoSave,
    equipoEliminar,
    equipoUpdate
}