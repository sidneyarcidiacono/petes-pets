// MODEL
const Pet = require('../models/pet');

exports.getPets = async (req, res) => {
  const currentPage = req.query.page || 1
  const perPage = 2
  const count = await Pet.find().countDocuments()
  pets = await Pet.find()
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
  res.render('pets-index', {
    pets: pets,
    pagesCount: count / perPage,
    currentPage: currentPage
  });
};
