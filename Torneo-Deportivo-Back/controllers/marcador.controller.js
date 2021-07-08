'use strict'

var marcadorModel = require("../models/marcador.model");
var torneoModel = require("../models/torneo.model");
var equipoModel = require("../models/equipo.model");
var userModel = require("../models/user.model");

/* Save Marcador */
function marcadorSave (req, res) {
    var userId = req.params.userId;
    var equipoId = req.parms.equipoId;
    var marcador = new marcadorModel();
    var params = req.body;

    

}

/* Update marcador */
function marcadorUpdate(req, res) {
    
}
/* Delete marcador */
function marcadorDelete(req,res) {
    
}

/* Exports */
module.exports = {
    marcadorSave,
    marcadorUpdate,
    marcadorDelete
}