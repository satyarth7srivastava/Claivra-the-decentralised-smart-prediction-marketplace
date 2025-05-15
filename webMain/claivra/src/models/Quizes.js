import mongoose from "mongoose";

const QuizesSchema = new mongoose.Schema(
  {
    quizID: {
      type: String,
      required: true,
      unique : true,
    },
    quizName: {
      type: String,
      required: true,
    },
    quizDescription: {
      type: String,
      required: true,
    },
    minBetAmt: {
      type: Number,
      required: true,
    },
    maxBetAmt: {
      type: Number,
      required: true,
    },
    quizOptions: {
      type: [
        {
          optionID: {
            type: Number,
            required: true,
          },
          optionText: {
            type: String,
            required: true,
          },
          totalBet: {
            type: Number,
            default: 0,
          },
        },
      ],
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    owner: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Quizes = mongoose.models.quizes || mongoose.model("quizes", QuizesSchema);
export default Quizes;
