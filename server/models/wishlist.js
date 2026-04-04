const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    products: [
      {
        type: ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
