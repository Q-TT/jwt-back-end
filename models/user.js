const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    hashedPassword: {
        type: String,
        required: true,
    }
})

//! remove the hashed password from return
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

module.exports = mongoose.model("User", userSchema)