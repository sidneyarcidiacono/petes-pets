"use strict";

const mongoose = require('mongoose'),
        Schema = mongoose.Schema;

const PetSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    species: { type: String, required: true, maxLength: 25 },
    birthday: { type: Date, required: true },
    picUrl: { type: String, required: true, maxLength: 50 },
    picUrlSq: { type: String, required: true, maxLength: 50 },
    favoriteFood: { type: String, required: true, maxLength: 25 },
    description: { type: String, required: true, maxLength: 250 }
},
{
  timestamps: true
});

module.exports = mongoose.model('Pet', PetSchema);
