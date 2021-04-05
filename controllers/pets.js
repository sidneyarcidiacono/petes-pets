// MODEL
const Pet = require('../models/pet');

exports.searchPets = (req, res) => {
  term = new RegExp(req.query.term, 'i')

  Pet.find({$or:[
    {name: term},
    {species: term}
    ]
  }).exec((err, pets) => {
    res.render('pets-index', { pets: pets });
  })
}

// NEW PET
exports.getNewPetForm = (req, res) => {
  res.render('pets-new');
}

// CREATE PET
exports.addNewPet = (req, res) => {
  const pet = new Pet(req.body);

  pet.save()
    .then((pet) => {
      res.redirect(`/pets/${pet._id}`);
    })
    .catch((err) => {
      // Handle Errors
      console.log(err.message)
      throw new Error("Unable to add pet.")
    }) ;
}

// SHOW PET BY ID
exports.getPetDetails = (req, res) => {
  Pet.findById(req.params.id).exec((err, pet) => {
    res.render('pets-show', { pet: pet });
  });
}

// SHOW PET EDIT FORM
exports.getEditPetForm = (req, res) => {
  Pet.findById(req.params.id).exec((err, pet) => {
    res.render('pets-edit', { pet: pet });
  });
}

// EDIT PET
exports.editPet = (req, res) => {
  Pet.findByIdAndUpdate(req.params.id, req.body)
    .then((pet) => {
      res.redirect(`/pets/${pet._id}`)
    })
    .catch((err) => {
      // Handle Errors
      console.log(err.message)
      throw new Error("Something went wrong while editing this pet.")
    });
}

// PURCHASE
// TODO: test this when we have FE ability to purchase pets
exports.purchasePet = (req, res) => {
  console.log(req.body);
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  var stripe = require("stripe")(process.env.PRIVATE_STRIPE_API_KEY);

  // Token is created using Checkout or Elements!
  // Get the payment token ID submitted by the form:
  const token = req.body.stripeToken; // Using Express

  // req.body.petId can become null through seeding,
  // this way we'll insure we use a non-null value
  let petId = req.body.petId || req.params.id;

  Pet.findById(petId).exec((err, pet) => {
    if(err) {
      console.log('Error: ' + err);
      res.redirect(`/pets/${req.params.id}`);
    }
    const charge = stripe.charges.create({
      amount: pet.price * 100,
      currency: 'usd',
      description: `Purchased ${pet.name}, ${pet.species}`,
      source: token,
    }).then((chg) => {
    // Convert the amount back to dollars for ease in displaying in the template
      const user = {
        email: req.body.stripeEmail,
        amount: chg.amount / 100,
        petName: pet.name
      };
      // Call our mail handler to manage sending emails
      mailer.sendMail(user, req, res);
    })
    .catch(err => {
      console.log('Error: ' + err);
    });
  })
}

// DELETE PET
exports.deletePet = (req, res) => {
  Pet.findByIdAndRemove(req.params.id).exec((err, pet) => {
    return res.redirect('/')
  });
}
