const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
        require: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    createdAt: {
        type: Date,
        default: () => {
            return Date.now()
        },
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: () => {
            return Date.now()
        }
    }
});


module.exports = mongoose.model("file", fileSchema);