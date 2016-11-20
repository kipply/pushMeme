//group.js
var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({

  group : {
    name: String,
    password: String,
    members: [],

    groupgoals: [{
      details: String,
      tasks:[{
        details: String,
        weight: Number,
        endDate: String,
        public: Boolean,
        user: String
      }]
    }]

  }

});

var Group = mongoose.model('Group', groupSchema);
module.exports = Group;
