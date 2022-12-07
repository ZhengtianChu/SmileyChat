const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  salt: {
    type: String,
  },
  hash: {
    type: String,
  },
  auth: {
    type: String,
  }
})

module.exports = userSchema;