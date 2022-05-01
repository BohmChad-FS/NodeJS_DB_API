const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    producer: {
        type: String,
        required: true
    },
    year: 
    {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Movie", movieSchema);