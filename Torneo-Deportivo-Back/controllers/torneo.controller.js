'use strict'

const torneoModel = require("../models/torneo.model");
const userModel = require("../models/user.model");
const fs = require('fs');
const path = require('path');

function uploadImageTorneo(req, res) {
    var torneoId = req.params.torneoId;
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
                torneoModel.findByIdAndUpdate(torneoId, { imageTorneo: fileName }, { new: true }, (err, torneoUpdated) => {
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
function getImageTorneo(req, res) {
    var fileName = req.params.fileName;
    var pathFile = './uploads/torneo/' + fileName;

    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(404).send({ message: 'Imagen inexistente' });
        }
    })
}


/* Save Torneo*/
function saveTorne(req, res) {
    var userId = req.params.userId;
    var torneo = new torneoModel();
    var params = req.body;

    if (userId != req.user.sub) {
        return res.status(401).send({ message: 'No tiene permiso para realizar esta acción ' });
    } else {
        userModel.findById(userId, (err, useFind) => {
            if (err) {
                return res.status(500).send({ message: 'Error General', err });
            } else if (useFind) {
                if (params.name) {
                    torneoModel.findOne({ name: params.name.toLowerCase() }, (err, torneoFind) => {
                        if (err) {
                            return res.status(500).send({ message: 'Error General', err });
                        } else if (torneoFind) {
                            return res.send({ message: 'Nombre de Torneo Ya En uso' });
                        } else {
                            if (params.name) {
                                torneo.name = params.name.toLowerCase();
                                torneo.dateInit = params.dateInit;
                                torneo.dateEnd = params.dateEnd;
    
                                torneo.save((err, torneoSave) => {
                                    if (err) {
                                        return res.status(500).send({ message: 'Error General', err });
                                    } else if (torneoSave) {
                                        userModel.findByIdAndUpdate(userId, { $push: { torneo: torneoSave } }, { new: true }, (err, torneoPush) => {
                                            if (err) {
                                                return res.status(500).send({ message: 'Error General', err });
                                            } else if (torneoPush) {
                                                return res.send({ message: 'Torneo Guardado Con exito', torneoPush });
                                            } else {
                                                return res.status(401).send({ message: 'No se Pudo Guardar Torneo' });
                                            }
                                        }).populate('torneo');
                                    } else {
                                        return res.status(500).send({ message: 'Error al Guardar Torneo' });
                                    }
                                });
                            } else {
                                return res.status(401).send({message: 'Porfavor ingrese los datos necesarios para realizar esta petición'});
                            }

                        }
                    });
                } else {
                    return res.status(401).send({ message: 'Porfavor ingrese todo los datos Obligatorios' });
                }
            } else {
                return res.status(401).send({ message: 'Usuario No Encontrado' });
            }
        });
    }


}

/* Update Torneo */
function updateTorneo(req, res) {
    var userId = req.params.userId;
    var torneoId = req.params.torneoId;
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(401).send({ message: 'No tiene permiso para realizar esta acción ' });
    } else {
        if (update.name) {
            torneoModel.findById(torneoId, (err, torneoFind) => {
                if (err) {
                    return res.status(500).send({ message: 'Error General', err });
                } else if (torneoFind) {
                    userModel.findOne({ _id:userId, torneo: torneoId }, (err, userFind) => {
                        if (err) {
                            return res.status(500).send({ message: 'Error General', err });
                        } else if (userFind) {
    
                            update.name = update.name.toLowerCase();
                            torneoModel.findOne({ name: update.name.toLowerCase() }, (err, torneoFindone) => {
                                if (err) {
                                    return res.status(500).send({ message: 'Error General', err });
                                } else if (torneoFindone) {
                                    if (torneoFindone._id == torneoId) {
                                        torneoModel.findByIdAndUpdate(torneoId, update, { new: true }, (err, torneoUpdate) => {
                                            if (err) {
                                                return res.status(500).send({ message: 'Error General', err });
                                            } else if (torneoUpdate) {
    
                                                return res.send({ message: 'Torneo Actualizado Correctamente', torneoUpdate });
                                            } else {
                                                return res.send({ message: 'No se pudo actualizar el Torneo' });
                                            }
                                        });
                                    } else {
                                        return res.status(401).send({ message: 'Nombre de Torneo ya en uso' });
                                    }
                                } else {
                                    torneoModel.findByIdAndUpdate(torneoId, update, { new: true }, (err, torneoUpdate) => {
                                        if (err) {
                                            return res.status(500).send({ message: 'Error General', err });
                                        } else if (torneoUpdate) {
    
                                            return res.send({ message: 'Torneo Actualizado Correctamente', torneoUpdate });
                                        } else {
                                            return res.send({ message: 'No se pudo actualizar el Torneo' });
                                        }
                                    });
                                }
                            });
                        } else {
                            return res.send({ message: 'No existe Usuario, o usuario no tiene torneos' });
                        }
                    });
                } else {
                    return res.send({ message: 'No existe Torneo' });
                }
            });
        } else {
            return res.status(401).send({message: 'Porfavor ingrese los datos necesarios para realizar esta petición'})
        }

    }

}

/* Delete Torne */
function removeTorneo(req, res) {
    var torneoId = req.params.torneoId;
    var userId = req.params.userId;

    if (userId != req.user.sub) {
        return res.status(401).send({ message: 'No tiene permiso para realizar esta acción ' });
    } else {
        userModel.findByIdAndUpdate({ _id: userId, torneo: torneoId },
            { $pull: { torneo: torneoId } }, { new: true }, (err, torneoPull) => {
                if (err) {
                    return res.status(500).send({ message: 'Error General', err });
                } else if (torneoPull) {
                    torneoModel.findOne({ _id: torneoId }, (err, torneoFind) => {
                        if (err) {
                            return res.status(500).send({ message: 'Error General', err });
                        } else if (torneoFind) {
                            torneoModel.findByIdAndRemove(torneoId, (err, torneoRemoved) => {
                                if (err) {
                                    return res.status(500).send({ message: 'Error general al eliminar' });
                                } else if (torneoRemoved) {

                                    return res.send({ message: 'Torneo eliminado', torneoRemoved });
                                } else {
                                    return res.status(403).send({ message: 'Torneo no eliminado' });
                                }
                            });

                        } else {
                            return res.status(401).send({ message: 'Torneo No Encontrado, o Eliminado' });
                        }
                    });
                } else {
                    return res.status(401).send({ message: 'No se pudo Eliminar' });
                }
        });
    }


}


function getTorneos(req, res) {
    var torneoId = req.params.torneoId;
    var userId = req.params.userId;

    torneoModel.find({}).exec((err, torneos) => {
        if (err) {
            return res.status(500).send({ message: 'Error general en el servidor' })
        } else if (torneos) {
            return res.send({ message: 'torneos',torneos })
        } else {
            return res.status(404).send({ message: 'No hay torneos' })
        }
    })
}
module.exports = {
    saveTorne,
    updateTorneo,
    removeTorneo,
    getTorneos,
    uploadImageTorneo,
    getImageTorneo
};
