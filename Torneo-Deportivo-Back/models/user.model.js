'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = Schema({
    name: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    phone: Number,
    role: String,
    image: String,
    torneo: [{ type: Schema.ObjectId, ref: 'torneo' }]
});
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10).then(salts => {
        bcrypt.hash(this.password, salts).then(hash => {
            this.password = hash;
            next();
        }).catch(error => next(error));
    }).catch(error => next(error));
});

module.exports = mongoose.model('user', userSchema);