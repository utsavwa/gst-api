const mongoose = require("mongoose");

const gstSchema = new mongoose.Schema({
    gstin: {
        type: String,
        required: [true, "GST Number is requiresd"],
    },
    gstData: {
        type: Object,
    },
});

module.exports = mongoose.model("Gst", gstSchema);