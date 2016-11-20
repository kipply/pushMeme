// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var badgeSchema = mongoose.Schema({
  name: String,
  fileName: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Badge', badgeSchema);
