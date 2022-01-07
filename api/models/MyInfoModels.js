const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var MyinfoSchema = new Schema({
    isEnabled: {
        type: Boolean
    },
    dataClient: []


}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
const Myinfo = mongoose.model("my_wallet", MyinfoSchema);
module.exports = { Myinfo }