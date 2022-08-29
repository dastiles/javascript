const mongoose = require("mongoose")


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
    },
    name: {
        type: String,
        required:true,
    },
    phonenumber: {
        type: String,
        required:true
    },
    deposits: {
        type: Number,
        default:0
    },
    balance: {
        type: Number,
        default:0
    },
    activeTickets: {
        type: Number,
        default:0
    },
    agentcode: {
        type: String,
        required:true
    }
})

const depositSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
       
    },

    confirmationMessage: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false
    },
 depositedAt: Date
})

module.exports.User = mongoose.model("Users", UserSchema)
module.exports.deposits = mongoose.model('Deposits', depositSchema)