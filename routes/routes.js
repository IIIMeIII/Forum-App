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
    app.get('/topicList', function(req, res) {
        let sqlquery = "SELECT name FROM topic"; // query database to get all the topics
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }

            // merge forumData with the {topicList:result} object to create a new object newData to be passed to the ejs file
            let newData = Object.assign({}, forumData, {topicList:result});
            console.log(newData);
            res.render("topicList.ejs", newData);

         });
    });
    
   
    //-----------------------------------------------------------------------
    app.get('/posts/:name', function(req, res) {
        // query database to get all topics
        let sqlquery = "SELECT * FROM topic t LEFT JOIN post p ON t.topic_id = p.topic_id LEFT JOIN user u ON p.user_id = u.user_id WHERE t.name = ? ORDER by p.date DESC"; 
        // execute sql query
        db.query(sqlquery, [req.params.name], (err, result) => {
            if (err) {
                res.redirect('./'); 
                return console.error(err.message);
            }

            forumData.topicName = req.params.name;
            // merge forumData with the {availableTopics:result} object to create a new object newData to be passed to the ejs file
            let newData = Object.assign({}, forumData, {topics_posts:result});
            console.log(newData);
            res.render("posts.ejs", newData);

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