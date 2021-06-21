const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');

const Activity = require('../models/activity');

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
  Activity.findById(req.params.id)
    .populate('vehicle')
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: `No such client.` });
    });
});

// READ (ALL)
router.get('/', (req, res) => {
  Activity.find({})
    .populate('vehicle')
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// READ (ALL BY CLIENT)
router.get('/client/:clientID', (req, res) => {
  Activity.find({client: req.params.clientID})
    .populate('vehicle')
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// READ (ALL BY VEHICLE)
router.get('/vehicle/:vehicleID', (req, res) => {
  Activity.find({vehicle: req.params.vehicleID})
    .populate('vehicle')
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// CREATE
router.post('/', postLimiter, (req, res) => {

  let newActivity = new Activity({
    client: req.body.client,
    vehicle: req.body.vehicle,
    kilometrage: req.body.kilometrage,
    log: req.body.log,
  });

  newActivity.save()
    .then((result) => {
      res.json({
        success: true,
        msg: `Successfully added!`,
        result: {
          _id: result._id,
          client: result.client,
          vehicle: result.vehicle,
          kilometrage: result.kilometrage,
          log: result.log
        }
      });
    })
    .catch((err) => {
      if (err.errors) {
        // Show failed if all else fails for some reasons
        res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

// UPDATE
router.put('/:id', (req, res) => {

  let updatedActivity = {
    client: req.body.client,
    vehicle: req.body.vehicle,
    kilometrage: req.body.kilometrage,
    log: req.body.log,
  };

  Activity.findOneAndUpdate({ _id: req.params.id }, updatedActivity, { runValidators: true, context: 'query' })
    .then((oldResult) => {
      Activity.findOne({ _id: req.params.id })
        .then((newResult) => {
          res.json({
            success: true,
            msg: `Successfully updated!`,
            result: {
              _id: newResult._id,
              client: newResult.client,
              vehicle: newResult.vehicle,
              kilometrage: newResult.kilometrage,
              log: newResult.log
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
        // Show failed if all else fails for some reasons
        res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

// DELETE
router.delete('/:id', (req, res) => {

  Activity.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.json({
        success: true,
        msg: `It has been deleted.`,
        result: {
          _id: result._id,
          client: result.client,
          vehicle: result.vehicle,
          kilometrage: result.kilometrage,
          log: result.log
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'Nothing to delete.' });
    });
});

module.exports = router;
