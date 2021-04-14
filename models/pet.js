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
    picUrl: { type: String, maxLength: 50 },
    picUrlSq: { type: String, maxLength: 50 },
    avatarUrl: { type: String, required: true },
    favoriteFood: { type: String, required: true, maxLength: 25 },
    description: { type: String, required: true, maxLength: 250 },
    price: { type: Number, required: true }
},
{
  timestamps: true
});

PetSchema.index({ name: 'text', species: 'text', favoriteFood: 'text', description: 'text' },
                {name: 'My text index', weights: {name: 10, species: 4, favoriteFood: 2, description: 1}});

module.exports = mongoose.model('Pet', PetSchema);
