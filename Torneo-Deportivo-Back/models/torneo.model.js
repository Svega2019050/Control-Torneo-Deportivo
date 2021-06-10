'use strict'

const mongoose = require("mongoose")
const Schema = mongoose.Schema;

var torneoSchema = Schema({
    name: String,
    dateInit: Date,
    dateEnd: Date,
    league:[{type: Schema.ObjectId, ref: 'liga'}]
});


module.exports = mongoose.model('torneo', torneoSchema);
