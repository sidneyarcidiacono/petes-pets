// MODEL
const Pet = require('../models/pet');

exports.getPets = async (req, res) => {
  const currentPage = req.query.page || 1
  const perPage = 2
  const count = await Pet.find().countDocuments()
  const pets = await Pet.find()
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
  res.render('pets-index', {
    pets: pets,
    pagesCount: count / perPage,
    currentPage: currentPage
  });
};

exports.searchPets = async (req, res) => {
  const currentPage = req.query.page || 1
  const perPage = 2
  const count = await Pet.find().countDocuments()
  console.log(`Count line 8: ${count}`)
  const term = new RegExp(req.query.term, 'i')
  const pets = await Pet.find({$or:[
    {name: term},
    {species: term}
    ]
  })
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
  console.log(`Pets line 16: ${pets}`)
  res.render('pets-index', {
    pets: pets,
    pagesCount: count / perPage,
    currentPage: currentPage
  });
}
