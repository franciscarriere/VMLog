const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

const nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 40],
    message: 'Name must not exceed {ARGS[1]} characters.'
  })
];

const emailValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 40],
    message: 'Email must not exceed {ARGS[1]} characters.'
  }),
  validate({
    validator: 'isEmail',
    message: 'Email must be valid.'
  })
];

const phoneValidator = [
  validate({
    validator: function(v) {
      //TODO expand this for international numbers
      return /\d{3}-\d{3}-\d{4}/.test(v);
    },
    message: props => `${props.value} is not a valid phone number!`
  })
]

// Define the database model
const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    validate: nameValidator
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    validate: emailValidator
  },
  phone: {
    type: String,
    required: [true, 'Phone No. is required.'],
    unique: true,
    validate: phoneValidator
  }
}, { timestamps: true });

// Use the unique validator plugin
ClientSchema.plugin(unique, { message: 'That {PATH} is already taken.' });

const Client = module.exports = mongoose.model('client', ClientSchema);
