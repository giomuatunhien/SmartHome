// Models/device.model.js
const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema(
    {
        deviceName: {
            type: String,
            required: [true, "Device name is required"],
            unique: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["fan", "light"],
            required: true,
        },
        status: {
            type: String,
            enum: ["On", "Off"],
            default: "Off",
        },
        speed: {
            type: Number,
            min: 0,
            max: 100,
            default: null,
            validate: {
                validator: function (value) {
                    // Nếu là light, speed phải null
                    return this.type === "fan" || value === null;
                },
                message: "Speed phải là null khi device là light.",
            },
        },
        activationThreshold: {
            type: Number,
            required: [true, "Activation threshold is required"],
            default: 0,
        },
        deactivationThreshold: {
            type: Number,
            required: [true, "Deactivation threshold is required"],
            default: 0,
        },
        systemID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "system",
            required: true,
        },
    },
    { timestamps: true }
);

const Device = mongoose.model("Device", DeviceSchema, "device");

module.exports = Device;
