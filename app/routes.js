var User = require('../app/models/user');
module.exports = function(app, passport) {
var Group = require('../app/models/group.js');


    app.get('/', function(req, res) {
        res.render('index.pug');
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.pug', {
            user : req.user
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

        app.get('/login', function(req, res) {
            res.render('login.pug', { message: req.flash('loginMessage') });
        });

        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        app.get('/signup', function(req, res) {
            res.render('signup.pug', { message: req.flash('signupMessage') });
        });

        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

        app.get('/connect/local', function(req, res) {
            res.render('connect-local.pug', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

            // takes you to the group home page where you can join group or search for groups
            app.get('/group', function(req, res) {
              res.render('group.pug')
            })

            app.get('/group/:id', function(req, res) {
              var id = req.params.id;
              //var group = req.params;
              //console.log(req.query.name);
              //console.log("A" + group);
              Group.findOne({
                '_id': id
              }, function(err, group){
                if(err)
                  throw err;
                  res.render('group-home.pug', {group: group});
                  console.log(group)
              })

              //res.send('id: ' + req.query.id);
            });



            // takes you to the create a group page
            app.get('/creategroup', function(req, res) {
              res.render('create-group.pug')
            });

            // creates a new group with attributes of name and password
            app.post('/createnewgroup', function(req, res) {

              var groupName = req.body.groupname;
              var password = req.body.password;
              console.log(req.body.password);

              var newgroup = new Group();

              // sets the attributes from the forms
              newgroup.group.name = groupName;
              newgroup.group.password = password;

              console.log(newgroup);
              newgroup.save(function(err, savedGroup) {
                if (err)
                  return handleError(err);
                if(savedGroup){
                    console.log("Group Saved")
                    console.log(savedGroup)
                }else{
                  console.log("Group not saved");
                }
                var groupid = savedGroup.id;
                var groupy = savedGroup;
                res.redirect('/group/' + groupid);
              });

            });

            app.get('/joingroup', function(req, res) {
              res.redirect()
            });



    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    app.get('/new-goal', isLoggedIn, function(req, res) {
        res.render('new-goal.pug');
    });

    app.post('/create-new-goal', isLoggedIn, function(req, res){
        console.log(req.body);
        addedGoals = req.user.goals;
        var tasks = [];
        for (var i = 0; i < req.body.taskName.length; i++){
            tasks.push({
                details: req.body.taskName[i],
                weight: req.body.difficulty[i],
                dueDate: req.body.dueDate[i],
                completed: false
            })
        }

        addedGoals.push({
            details: req.body.goalName,
            tasks:tasks
        })
        User.update({_id: req.user._id}, {
            goals: addedGoals
        }, function(err, numberAffected, rawResponse) {
           //handle it
        })

        res.redirect('/new-goal')
    })

    app.get('/goals', isLoggedIn, function(req, res) {
        res.render('goals.pug', {goals: req.user.goals});
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
