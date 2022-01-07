const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var NamiSchema = new Schema({
    network: {},
    address: {
        type: String
    },
    address_hex: {
        type: String
    },
    utxos: [],
    utxos_hex: [],
    reward_address: {
        type: String
    },
    reward_address_hex: {
        type: String
    },
    assets: [],
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
const NamiAPI = mongoose.model("nami_api", NamiSchema);
module.exports = { NamiAPI }