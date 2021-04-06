// MODEL
const Pet = require('../models/pet');

// Validation
const { validationResult } = require('express-validator')

// NEW PET
exports.getNewPetForm = (req, res) => {
  res.render('pets-new');
}

// CREATE PET
exports.addNewPet = async (req, res) => {
  const errors = validationResult(req)
   if (!errors.isEmpty()) {
     const error = errors.array()[0].param.replace(/([A-Z])/g, ' $1')
     const formattedError = encodeURIComponent(
       error.charAt(0).toUpperCase() + error.slice(1)
     )
     res.status(422).redirect(`/pets/new?error=${formattedError}`)
   }
  try {
    const pet = new Pet(req.body);
    await pet.save()
    res.redirect(`/pets/${pet._id}`);
  } catch (err) {
    res.status(400).send(err.message)
  }
}

// SHOW PET BY ID
exports.getPetDetails = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
    res.render('pets-show', { pet: pet });
  } catch (err) {
    res.status(404).send(err.message)
  }
}

// SHOW PET EDIT FORM
exports.getEditPetForm = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
    res.render('pets-edit', { pet: pet });
  } catch (err) {
    res.status(500).send(err.message)
  }
}

// EDIT PET
exports.editPet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body)
    res.redirect(`/pets/${pet._id}`)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

// PURCHASE
// TODO: test this when we have FE ability to purchase pets
exports.purchasePet = (req, res) => {
  console.log(req.body);
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  const stripe = require("stripe")(process.env.PRIVATE_STRIPE_API_KEY);

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
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndRemove(req.params.id)
    return res.redirect('/')
  } catch (err) {
    res.status(500).send(err.message)
  }
}
