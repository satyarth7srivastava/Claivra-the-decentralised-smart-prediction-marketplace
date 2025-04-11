import mongoose from "mongoose";

const QuizesSchema = new mongoose.Schema({
    quizeID: {
        type: Number,
        required: true,
        unique: true
    },
    quizeName: {
        type: String,
        required: true
    },
    quizeDescription: {
        type: String,
        required: true
    },
    minBetAmt: {
        type: Number,
        required: true
    },
    maxBetAmt: {
        type: Number,
        required: true
    },
    quizeOptions: {
        type: [
            {
                optionID: {
                    type: Number,
                    required: true
                },
                optionText: {
                    type: String,
                    required: true
                },
                totalBet: {
                    type: Number,
                    default: 0
                }
            }
        ],
        required: true
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    owner: {
        type: String,
        required: true
    }
});


const Quizes = mongoose.models.quizes || mongoose.model('quizes', QuizesSchema);
export default Quizes;