const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var NamiSenderSchema = new Schema({
    price: {
        type: Number
    },
    password: {
        type: String
    },
    address: {
        type: String
    }


}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
const SenderApi = mongoose.model("send_cost", NamiSenderSchema);
module.exports = { SenderApi }