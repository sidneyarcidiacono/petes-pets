// MODEL
const Pet = require('../models/pet');

exports.getPets = (req, res) => {
  Pet.find().exec((err, pets) => {
    res.render('pets-index', { pets: pets });
  });
}
