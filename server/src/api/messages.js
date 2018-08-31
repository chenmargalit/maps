const express = require('express');
const Joi = require('joi');

const db = require('../db');
const messages = db.get('messages');

const schema = Joi.object().keys({
name: Joi.string().min(1).max(30).required(),
message: Joi.string().min(1).max(500).required(),
latitude: Joi.number().min(-90).max(90).required(),
longitude: Joi.number().min(-180).max(180).required()
});

const router = express.Router();

router.get('/', (req, res) => {
  messages.find()
  .then(allMessages => {
    res.json(allMessages)
  });
});

router.post('/', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    const userMessage = {
      name: req.body.name,
      message: req.body.message,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      date: new Date()
    };
    messages.insert(userMessage)
      .then(insertedMessage => {
        res.json(insertedMessage)
      });
  } else {
    console.log('coming from server side messags');
    console.log(error);
    next(result.error)
    console.log(error);
    
  }

});



module.exports = router;
