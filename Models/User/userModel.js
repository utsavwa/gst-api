const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    gstin: {
        type: String,
        required: [true, "GST Number is required"],
    },
    password: {
        type: String,
        required: [true, "Please fill your password"],
        minLength: 6,
        select: false,
    },
},
    {
        timestamps: true
    }
);

// This is Instance Method that is gonna be available on all documents in a certain collection
userSchema.methods.correctPassword = async function (
    typedPassword,
    originalPassword,
) {
    return await bcrypt.compare(typedPassword, originalPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;