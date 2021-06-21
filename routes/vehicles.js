const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');

const Vehicle = require('../models/vehicle');

// Attempt to limit spam post requests for inserting data
const minutes = 5;
const postLimiter = new RateLimit({
  windowMs: minutes * 60 * 1000, // milliseconds
  max: 100, // Limit each IP to 100 requests per windowMs 
  delayMs: 0, // Disable delaying - full speed until the max limit is reached 
  handler: (req, res) => {
    res.status(429).json({ success: false, msg: `You made too many requests. Please try again after ${minutes} minutes.` });
  }
});

// READ (ONE)
router.get('/:id', (req, res) => {
  Vehicle.findById(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: `No such vehicle.` });
    });
});


// READ (ALL)
router.get('/', (req, res) => {
  Vehicle.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// READ (ALL BY CLIENT)
router.get('/client/:clientID', (req, res) => {
  Vehicle.find({client: req.params.clientID})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// CREATE
router.post('/', postLimiter, (req, res) => {

  let newVehicle = new Vehicle({
    client: req.body.client,
    makemodel: sanitizeMakeModel(req.body.makemodel),
    year: req.body.year,
    vin: req.body.vin
  });

  newVehicle.save()
    .then((result) => {
      res.json({
        success: true,
        msg: `Successfully added!`,
        result: {
          _id: result._id,
          client: result.client,
          makemodel: result.makemodel,
          year: result.year,
          vin: result.vin
        }
      });
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors.client) {
          res.status(400).json({ success: false, msg: err.errors.client.message });
          return;
        }
        if (err.errors.makemodel) {
          res.status(400).json({ success: false, msg: err.errors.makemodel.message });
          return;
        }
        if (err.errors.year) {
          res.status(400).json({ success: false, msg: err.errors.year.message });
          return;
        }

        // Show failed if all else fails for some reasons
        res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

// UPDATE
router.put('/:id', (req, res) => {

  let updatedVehicle = {
    makemodel: sanitizeMakeModel(req.body.makemodel),
    year: req.body.year,
    vin: req.body.vin
  };

  Vehicle.findOneAndUpdate({ _id: req.params.id }, updatedVehicle, { runValidators: true, context: 'query' })
    .then((oldResult) => {
      Vehicle.findOne({ _id: req.params.id })
        .then((newResult) => {
          res.json({
            success: true,
            msg: `Successfully updated!`,
            result: {
              _id: newResult._id,
              makemodel: newResult.makemodel,
              year: newResult.year,
              client: newResult.client,
              vin: newResult.vin
            }
          });
        })
        .catch((err) => {
          res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
          return;
        });
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors.makemodel) {
          res.status(400).json({ success: false, msg: err.errors.makemodel.message });
          return;
        }
        if (err.errors.year) {
          res.status(400).json({ success: false, msg: err.errors.year.message });
          return;
        }

        // Show failed if all else fails for some reasons
        res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

// DELETE
router.delete('/:id', (req, res) => {

  Vehicle.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.json({
        success: true,
        msg: `It has been deleted.`,
        result: {
          _id: result._id,
          makemodel: result.makemodel,
          year: result.year,
          client: result.client,
          vin: result.vin
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'Nothing to delete.' });
    });
});

module.exports = router;

// Minor sanitizing to be invoked before reaching the database
sanitizeMakeModel = (name) => {
  return stringCapitalizeName(name);
}
