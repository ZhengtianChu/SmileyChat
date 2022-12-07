const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  username: String,
  displayName: String,
  headline: String,
  email: String,
  zipcode: Number,
  birthday: Date,
  avatar: String,
  phoneNum: String,
  followingList: [],
  auth:{}
})

module.exports = profileSchema;