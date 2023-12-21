module.exports = function(app, forumData) {

    // Handle our routes
    app.get('/',function(req,res){
        forumData.userData = false;
        if (req.session.user) {
            forumData.userData = req.session.user;
        }

        console.log(forumData.userData);
        res.render('index.ejs', forumData);
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
        forumData.userData = false;
        if (req.session.user) {
            forumData.userData = req.session.user;
        }
        // query database to get all posts
        let sqlquery = `SELECT t.topic_id, p.post_id, p.title, p.content, u.username, p.date
                        FROM topic t 
                        LEFT JOIN post p 
                        ON t.topic_id = p.topic_id 
                        LEFT JOIN user u 
                        ON p.user_id = u.user_id 
                        WHERE t.name = ? 
                        ORDER BY p.date DESC`; 
        // execute sql query
        db.query(sqlquery, [req.params.name], (err, result) => {
            if (err) {
                res.redirect('./'); 
                return console.error(err.message);
            }
            // merge forumData with the {topics_posts:result} object to create a new object newData to be passed to the ejs file
            let newData = Object.assign({}, forumData, {topics_posts:result});
            sqlquery = `SELECT r.content, r.date, r.user_id, r.reply_id, r.post_id, u.username
                        from user u
                        LEFT JOIN reply r
                        ON u.user_id = r.user_id`;
            db.query(sqlquery, (err, result) => {
                if (err) {
                    res.redirect('./');
                    return console.error(err.message);
                }
                // merge forumData with the {replies:result} object to create a new object newData to be passed to the ejs file
                newData = Object.assign({}, newData, {replies:result});
                
                console.log(result);
                newData.replies = result;
                newData.topicName = req.params.name;
                console.log(newData);
                res.render("posts.ejs", newData);
            });
         });
    });

    app.get('/postlist', function(req, res) {
        forumData.userData = false;
        if (req.session.user) {
            forumData.userData = req.session.user;
        }
        // query database to get all posts
        let sqlquery = `SELECT t.name, p.post_id, p.title, p.content, p.date, u.username
                        FROM post p
                        LEFT JOIN topic t
                        ON t.topic_id = p.topic_id
                        LEFT JOIN user u
                        ON p.user_id = u.user_id
                        LEFT JOIN  reply r
                        ON p.post_id = r.post_id`; 
        // execute sql query
        db.query(sqlquery, [req.params.id], (err, result) => {
            if (err) {
                res.redirect('./'); 
                return console.error(err.message);
            }

            // merge forumData with the {topics_posts:result} object to create a new object newData to be passed to the ejs file
            let newData = Object.assign({}, forumData, {postList:result});
            console.log(newData);
            res.render("postList.ejs", newData);

         });
    });

    //-----------------------------------------------------------------------
    app.post('/replied', function(req, res) {
        // insert data into database
        sqlquery = `INSERT INTO reply (user_id, post_id, content)
                    VALUES (?,?,?)`;
        // execute sql query
        let newrecord = [req.session.user.id, req.body.repliedID, req.body.content];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                res.redirect('./');
                return console.error(err.message);
            }
            else {
                res.redirect(`/posts/${req.body.topicname}`);
            }
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
        let sqlquery = "INSERT INTO user (firstname, surname, username, email, password) VALUES (?,?,?,?,?)";
        // execute sql query
        let newrecord = [req.body.firstname, req.body.surname, req.body.username, req.body.email, req.body.password];
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
    app.get('/signin',function(req,res){
        res.render('signin.ejs', forumData);
    });

    app.post('/signedin', function (req,res) {
        // query data base for information matching user input
        let sqlquery = `SELECT user.username, user.user_id
                        FROM user
                        WHERE user.username = ?
                        AND user.password = ?`;
        // execute sql query
        let newrecord = [req.body.username, req.body.password];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          } 
          // if there is no match then user is returned to home page
          else if (result.length == 0) {
            res.redirect('./');
            return;
          }
          
        req.session.user = {id: result[0].user_id, name: result[0].username};
        req.session.save();
        console.log(req.session.user);
          
        res.redirect('./');
        });

        app.get('/logout', function(req, res) {
            req.session.destroy();
            res.redirect('./');
        });
    });
}