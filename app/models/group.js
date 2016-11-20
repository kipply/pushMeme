//group.js
var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
    name: String,
    password: String,
    owner: String,
    members: [String],

    groupgoals: [{
        details: String,
      tasks:[{
        details: String,
        weight: Number,
        dueDate: String,
        completed: Boolean,
        user:String
      }]
    }]

});

var Group = mongoose.model('Group', groupSchema);
module.exports = Group;
