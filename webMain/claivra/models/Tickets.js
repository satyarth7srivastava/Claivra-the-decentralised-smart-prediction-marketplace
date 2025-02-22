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
    betAmount: {
        type: Number,
        required: true
    },
    betOption: {
        type: Number,
        required: true
    },
});


const Tickets = mongoose.models.tickets || mongoose.model('tickets', TicketSchema);
export default Tickets;