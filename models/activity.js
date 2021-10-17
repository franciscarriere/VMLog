const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

// Define the database model
const ActivitySchema = new mongoose.Schema({
  client: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'client',
      required: [true, 'Activity must belong to a client.']
  },
  vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'vehicle',
      required: false
  },
  kilometrage: {
      type: Number
  },
  log: { 
    type: String,
    required: false
  },
  attachments: [{
    type:String
  }],
}, { timestamps: true });

// Use the unique validator plugin
ActivitySchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Activity = module.exports = mongoose.model('activity', ActivitySchema);
