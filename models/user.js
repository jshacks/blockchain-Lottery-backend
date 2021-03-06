var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    walletID: {
        type: String,
        required: true,
    },
    winner: {
        type: Boolean,
        required: true,
    },
});

module.exports = mongoose.model('User', UserSchema);
