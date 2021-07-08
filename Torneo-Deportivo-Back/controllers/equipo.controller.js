'use strict'

const { update } = require('../models/equipo.model');
var modelEquipo = require('../models/equipo.model');
var torneoModel = require("../models/torneo.model");
var userModel = require("../models/user.model");

/* save */
function equipoSave(req,res) {
    var torneoId = req.params.torneoId;
    var userId = req.params.userId;
    var params = req.body;
    var equipo = new modelEquipo();

    if (userId != req.user.sub) {
        return res.status(401).send({message: 'No tiene permiso para realizar esta acción '});
    }else{
        torneoModel.findById(torneoId,(err, findTorneo)=>{
            if (err) {
                return res.status(500).send({message: 'Error General',err});
            }else if(findTorneo) {
                if (params.nameEquipo) {
                    modelEquipo.findOne({nameEquipo: params.nameEquipo.toLowerCase()},(err,equipoFind)=>{
                        if (err) {
                            return res.status(500).send({message: 'Error General',err});
                        }else if(equipoFind) {
                            return res.send({message: 'Nombre de Equipo Ya existe'});
                        } else {
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
                                return res.status(401).send({message: 'Porfavor ingrese los datos necesarios para realizar esta petición'})
                            }

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
}

/* Update */
function equipoUpdate(req,res) {
    var torneoId = req.params.torneoId;
    var equipoId = req.params.equipoId;
    var update = req.body;
    var userId = req.params.userId;

    if (userId != req.user.sub) {
        return res.status(401).send({message: 'No tiene permiso para realizar esta acción '});
    }else{
        if (update.nameEquipo) {
            modelEquipo.findById(equipoId,(err, equipoFind)=>{
                if (err) {
                    return res.status(500).send({message: 'Error General',err});
                } else if(equipoFind){
                    torneoModel.findOne({_id: torneoId, equipo: equipoId},(err, torneoFind)=>{
                        if (err) {
                            return res.status(500).send({message: 'Error General',err});
                        } else if(torneoFind){
                            if (update.nameEquipo) {
                                update.nameEquipo = update.nameEquipo.toLowerCase();
                                modelEquipo.findOne({nameEquipo: update.nameEquipo.toLowerCase()},(err,equipoFind)=>{
                                    if (err) {
                                        return res.status(500).send({message: 'Error General',err});
                                    }else if(equipoFind) {
                                        if (equipoFind._id == equipoId) {
                                            modelEquipo.findByIdAndUpdate(equipoId, update, {new: true}, (err, equipoUpdate)=>{
                                                if (err) {
                                                    return res.status(500).send({message: 'Error General'});
                                                } else if(equipoUpdate){
                                                    return res.send({message: 'Equipo Actualizado Exitosamente',equipoUpdate});
                                                }else{
                                                    return res.status(401).send({message: 'No se puedo actualizar el Equipo'});
                                                }
                                            });
                                        } else {
                                            return res.status(401).send({message: 'Nombre de Equipo Ya en uso'});
                                        }
                                    } else {
                                        modelEquipo.findByIdAndUpdate(equipoId, update, {new: true}, (err, equipoUpdate)=>{
                                            if (err) {
                                                return res.status(500).send({message: 'Error General'});
                                            } else if(equipoUpdate){
                                                return res.send({message: 'Equipo Actualizado Exitosamente',equipoUpdate});
                                            }else{
                                                return res.status(401).send({message: 'No se puedo actualizar el Equipo'});
                                            }
                                        });
                                    }
                                });
                            } else {
                                return res.status(401).send({message: 'Porfavor ingrese los datos necesarios para realizar esta petición'})
                            }

                            
                        }else{
                            return res.status(401).send({message: 'Torneo No existente'})
                        }
                    });
                }else{
                    return res.status(401).send({message:'Equipo No Existe en este torneo'});
                }
            });
        } else {
            return res.status(401).send({message:'por favor ingrese todo los datos necesarios'});
        }
    }

}

/* Eliminar */
function equipoEliminar(req,res) {
    var torneoId = req.params.torneoId;
    var equipoId = req.params.equipoId;
    var userId = req.params.userId;

    if (userId != req.user.sub) {
        return res.status(401).send({message: 'No tiene permiso para realizar esta acción '});
    }else{
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
                            return res.status(401).send({message: 'Equipo No Encontrada, En este Torneo'});
                        }
                    });
                }else{
                    return res.status(401).send({message: 'No se pudo Eliminar'});
                }
        });
    }




}


module.exports = {
    equipoSave,
    equipoEliminar,
    equipoUpdate
}