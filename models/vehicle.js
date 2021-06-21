const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

// Define the database model
const VehicleSchema = new mongoose.Schema({
  client : { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'client',
    required: [true, 'Vehicle must belong to a client.']
  },
  makemodel: {
    type: String,
    required: [true, 'Make/Model is required.']
  },
  year: {
    type: Number,
    required: [true, 'Year is required.'],
  },
  vin: {
    type: String,
    required: false
  }
}, { timestamps: true });

// Use the unique validator plugin
VehicleSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Vehicle = module.exports = mongoose.model('vehicle', VehicleSchema);
