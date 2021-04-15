// MODEL
const Pet = require('../models/pet');

exports.getPets = async (req, res) => {
  const currentPage = req.query.page || 1
  const perPage = 2
  const count = await Pet.find().countDocuments()
  const pets = await Pet.find()
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
  if (req.header('Content-Type') == 'application/json') {
    return res.json({ pets: pets, pagesCount: count / perPage, currentPage: currentPage })
  } else {
    res.render('pets-index', {
      pets: pets,
      pagesCount: count / perPage,
      currentPage: currentPage
    });
  }
};

exports.searchPets = (req, res) => {
  Pet.find(
          { $text : { $search : req.query.term } },
          { score : { $meta: "textScore" } }
      )
      .sort({ score : { $meta : 'textScore' } })
      .limit(20)
      .exec(function(err, pets) {
        if (err) { return res.status(400).send(err) }
        if (req.header('Content-Type') == 'application/json') {
          return res.json({ pets: pets });
        } else {
          return res.render('pets-index', { pets: pets, term: req.query.term });
        }
    });
}
