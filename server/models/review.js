const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: ObjectId,
      ref: "Product",
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    star: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, postedBy: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
