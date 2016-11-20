// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var badgeSchema = mongoose.Schema({
  user: String,
  name: String,
  fileName: String
});

// create the model for users and expose it to our app
var Badge = mongoose.model('Badge', badgeSchema);
module.exports = Badge;
