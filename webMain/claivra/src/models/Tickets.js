import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    ticketID: {
        type: String,
        required: true,
        unique: true
    },
    quizeID: {
        type: String,
        required: true
    },
    ownerAddress: {
        type: String,
        required: true
    },
    betAmount: {
        type: Number,
        required: true
    },
    betOption: {
        type: Number,
        required: true
    },
    isWidthdrawn:{
        type: Boolean,
        required: true,
        default: false
    },
    winAmount:{
        type: Number,
        required: true,
        default: 0
    }
});


const Tickets = mongoose.models.tickets || mongoose.model('tickets', TicketSchema);
export default Tickets;