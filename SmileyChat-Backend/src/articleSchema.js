const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    pid: Number,
    imgUrl: String,
    author: String,
    text: String,
    date: String,
    comments: [],
    disabled: Boolean
});

module.exports = articleSchema;