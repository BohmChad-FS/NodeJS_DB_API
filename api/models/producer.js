const mongoose = require("mongoose");

const producerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },
    producer: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Producer", producerSchema);