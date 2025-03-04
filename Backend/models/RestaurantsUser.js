const mongoose = require("mongoose");


const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, 
    },
    location: {
      type: String,
      required: true,
    },
    menu: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: { type: String }, 
  },
  { timestamps: true } 
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
