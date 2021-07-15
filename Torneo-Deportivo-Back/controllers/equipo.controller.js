'use strict'

const { update } = require('../models/equipo.model');
var modelEquipo = require('../models/equipo.model');
var torneoModel = require("../models/torneo.model");
var userModel = require("../models/user.model");
const fs = require('fs');
const path = require('path');

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
function getEquipo(req, res) {
    var torneoId = req.params.torneoId;
    var userId = req.params.userId;

    
    modelEquipo.find({}).exec((err, equipos) => {
        if (err) {
            return res.status(500).send({ message: 'Error general en el servidor' })
        } else if (equipos) {
            return res.send({ message: 'torneos',equipos })
        } else {
            return res.status(404).send({ message: 'No hay torneos' })
        }
    })

    
}

function getEquipos(req, res) {
    var torneoId = req.params.torneoId;
    var userId = req.params.userId;

    if (userId != req.user.sub) {
        return res.status(401).send({message: 'No tiene permiso para realizar esta acción '});
    }else{
        modelEquipo.find({ torneo: torneoId }, (err, equipo) => {
            if (err) {
              res.status(500).send({
                message: "Error en el servidor al integrar un equipo a un Torneo",
              });
            } else if(equipo){
                modelEquipo.find({}).exec((err, equipos) => {
                    if (err) {
                        return res.status(500).send({ message: 'Error general en el servidor' })
                    } else if (equipos) {
                        return res.send({ message: 'torneos',equipos })
                    } else {
                        return res.status(404).send({ message: 'No hay torneos' })
                    }
                })
            } else {
                res
                  .status(404)
                  .send({ message: "Datos nulos como respuesta del servidor" });
            }
            
        });
    }

  
}
  

function uploadImageEquipo(req, res) {
    var equipoId = req.params.equipoId;
    var userId = req.params.userId;
    var update = req.body;
    var fileName;

    if (userId != req.user.sub) {
        return res.status(401).send({message: 'No tiene permiso para realizar esta acción '});
    }else{
        if (req.files) {
            var filePath = req.files.imageTorneo.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[2];
    
            var extension = fileName.split('\.');
            var fileExt = extension[1];
            if (fileExt == 'png' ||
                fileExt == 'jpg' ||
                fileExt == 'jpeg' ||
                fileExt == 'gif') {
                modelEquipo.findByIdAndUpdate(equipoId, { imageTorneo: fileName }, { new: true }, (err, torneoUpdated) => {
                    if (err) {
                        res.status(500).send({ message: 'Error general' });
                    } else if (torneoUpdated) {
                        res.send({ torneo: torneoUpdated, torneoImage: torneoUpdated.imageTorneo });
                    } else {
                        res.status(400).send({ message: 'No se ha podido actualizar' });
                    }
                })
            } else {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        res.status(500).send({ message: 'Extensión no válida y error al eliminar archivo' });
                    } else {
                        res.send({ message: 'Extensión no válida' })
                    }
                })
            }
        } else {
            res.status(400).send({ message: 'No has enviado imagen a subir' })
        }
    }



}


/* view image */
function getimageEquipo(req, res) {
    var fileName = req.params.fileName;
    var pathFile = './uploads/equipo/' + fileName;

    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(404).send({ message: 'Imagen inexistente' });
        }
    })
}


module.exports = {
    equipoSave,
    equipoEliminar,
    equipoUpdate,
    getEquipo,
    uploadImageEquipo,
    getimageEquipo,
    getEquipos
}