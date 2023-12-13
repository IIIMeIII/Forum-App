module.exports = function(app, forumData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', forumData)
    });

    //-----------------------------------------------------------------------
    app.get('/about',function(req,res){
        res.render('about.ejs', forumData);
    });
   
    //-----------------------------------------------------------------------
    app.get('/topics', function(req, res) {
        let sqlquery = "SELECT * FROM topic"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }

            // merge forumData with the {availableTopics:result} object to create a new object newData to be passed to the ejs file
            let newData = Object.assign({}, forumData, {availableTopics:result});
            console.log(newData);
            res.render("topics.ejs", newData);

         });
    });

    //-----------------------------------------------------------------------
    app.get('/users', function(req, res) {
        let sqlquery = "SELECT * FROM user"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }

            // merge forumData with the {availableUsers:result} object to create a new object newData to be passed to the ejs file
            let newData = Object.assign({}, forumData, {availableUsers:result});
            console.log(newData);
            res.render("users.ejs", newData);

         });
    });

    //-----------------------------------------------------------------------
    app.get('/register', function (req,res) {
        res.render('register.ejs', forumData);                                                                     
    });

    app.post('/registered', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO user (firstname, surname, username, email) VALUES (?,?,?,?)";
        // execute sql query
        let newrecord = [req.body.firstname, req.body.surname, req.body.username, req.body.email];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            res.send('Thanks for signing up! '
                      + req.body.firstname + req.body.surname + 'Your username is: ' + req.body.username);
          }
        });
    });
    
    //-----------------------------------------------------------------------
    app.get('/signIn',function(req,res){
        res.render('signIn.ejs', forumData);
    });
}