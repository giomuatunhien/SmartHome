const mongoose = require("mongoose");

const EnvironmentDataSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    systemID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      length: 24,
    },
    sensorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sensor",
      length: 24,
      required: true,
    },
  }, { versionKey: false }
);

const EnvironmentData = mongoose.model("EnvironmentData", EnvironmentDataSchema, "environmentData");
module.exports = EnvironmentData;
