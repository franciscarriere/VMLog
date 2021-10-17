const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');
const formidable = require("formidable");
const path = require('path');
const uuid = require('uuid');
var fs = require('fs');

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

// ADD ATTACHMENT
router.post('/', (req, res) => {
  const form = formidable.IncomingForm();

  const uploadFolder = path.join(__dirname, "../public", "attachments");
  form.uploadDir = uploadFolder;

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
        console.log("Error parsing the files");
        return res.status(400).json({
          status: "Fail",
          message: "There was an error parsing the files",
          error: err,
        });
    }

    const file = files.file;
    const fileName = uuid.v4()
    console.log(file);
    
    try { 
        fs.renameSync(file.path, path.join(uploadFolder, fileName));
    } catch (error) {
        console.log(error);
    }

    //TODO let parent know of new attachment

    return res.status(200);
  });
})

// REMOVE ATTACHMENT
router.delete('/:id', (req, res) => {

})

module.exports = router;
