const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    gstId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gst'
    },
    reviewText: {
        type: String
    },
    rating: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Review", reviewSchema);