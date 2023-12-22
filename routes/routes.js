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
        forumData.userData = false;
        if (req.session.user) {
            forumData.userData = req.session.user;
        }
        let sqlquery = `SELECT name, topic_id 
                        FROM topic`; // query database to get all the topics
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
    app.get('/addpost',function(req,res){
        // user is only able to access this page if they are logged in
        if (req.session.user) {
            forumData.userData = req.session.user;
            // query database for topics the user is a member of
            let sqlquery = `SELECT t.name
                            FROM topic t
                            LEFT JOIN participant p
                            ON t.topic_id = p.topic_id
                            WHERE p.user_id = ?
                            ORDER BY name ASC`;
            db.query(sqlquery, [req.session.user.id], (err, result) => {
                if (err) {
                    res.redirect('./'); 
                    return console.error(err.message);
                } else if (result.length == 0) {
                    res.send("You need to join a topic to make a post!");
                    return;
                }
                // merge forumData with the {topics:result} object to create a new object newData to be passed to the ejs file
                let newData = Object.assign({}, forumData, {topics:result});
                console.log(newData);
                res.render('addpost.ejs', newData);
            });              
        } else {
            res.redirect('./'); 
        }

    });

    app.post('/postadded', function(req, res) {
        // query database to get topic name that matches the topic id
        let sqlquery = `SELECT topic_id
                        FROM topic
                        WHERE name = ?`;
        db.query(sqlquery, [req.body.topic], (err, result) => {
            if (err) {
                res.redirect('./'); 
                return console.error(err.message);
            }
            let topicid = result[0].topic_id;
            // saving data in database
            sqlquery = `INSERT INTO post
                        (user_id, topic_id, title, content)
                        VALUES (?,?,?,?)`;
            // execute sql query
            let newrecord = [req.session.user.id, topicid, req.body.title, req.body.content];
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    res.redirect('./');
                    return console.error(err.message);
                }
                res.redirect(`http://www.doc.gold.ac.uk/usr/136/posts/${req.body.topic}`)
            });
        });   
    })

    //-----------------------------------------------------------------------
    app.post('/jointopic', function (req,res) {
        forumData.userData = false;
        if (req.session.user) {
            forumData.userData = req.session.user;
        }
        // saving data in database
        let sqlquery = `INSERT INTO participant 
                        (user_id, topic_id) 
                        VALUES (?,?)`;
        // execute sql query
        let newrecord = [req.session.user.id, req.body.topicid];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
            res.redirect('./'); 
            return console.error(err.message);
            }
            req.session.user.topics.push({topic_id: req.body.topicid});
            req.session.save();
            res.redirect('./topiclist');
        });
    });
    
    app.post('/leavetopic', function (req,res) {
        forumData.userData = false;
        if (req.session.user) {
            forumData.userData = req.session.user;
        }
        // remove data from the database
        let sqlquery = `DELETE FROM participant 
                        WHERE topic_id = ?
                        AND user_id = ?`;
        // execute sql query
        let newrecord = [req.body.topicid, req.session.user.id];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                res.redirect('./'); 
                return console.error(err.message);
            }

            let index = req.session.user.topics.findIndex(item => item.topic_id == req.body.topicid);
            if (index > -1) {
                req.session.user.topics.splice(index, 1);
            }
            req.session.save();
            res.redirect('./topiclist');
        });
    });

    //-----------------------------------------------------------------------
    app.get('/search',function(req,res){
        res.render("search.ejs", forumData);
    });

    app.get('/search-result', function (req, res) {
        // searching the database
        let sqlquery = `SELECT * 
                        FROM post WHERE title = ?`;
        db.query(sqlquery, [req.query.keyword], (err, result) => {
            if (err) {
                res.redirect("./");
            } else {
                let newData = Object.assign({}, forumData, {availablePosts:result})
                console.log(newData);
                if (newData.availablePosts.length == 0) {
                    sqlquery = `SELECT * 
                                FROM post WHERE title LIKE ?`;
                    db.query(sqlquery, ["%" + req.query.keyword + "%"], (err, result) => {
                        if (err) {
                            res.redirect("./");
                        } 
                        else {

                            // merge forumData with the {availablePosts:result} object to create a new object newData to be passed to the ejs file 
                            newData = Object.assign({}, forumData, {availablePosts:result}); 
                            console.log(newData);
                            if (newData.availablePosts.length == 0) {
                                res.send("No posts found!");
                            } 
                            else {
                                res.render("search-results.ejs", newData);
                            }
                        }
                    })
                } else {
                    res.render("search-results.ejs", newData);
                }
            }
        })
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
                res.redirect(`http://www.doc.gold.ac.uk/usr/136/posts/${req.body.topicname}`);
            }
        });
    });

    //-----------------------------------------------------------------------
    app.get('/users', function(req, res) {
        let sqlquery = `SELECT * 
                        FROM user`; // query database to get all the books
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
        let sqlquery = `INSERT INTO user 
                        (firstname, surname, username, email, password) 
                        VALUES (?,?,?,?,?)`;
        // execute sql query
        let newrecord = [req.body.firstname, req.body.surname, req.body.username, req.body.email, req.body.password];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
            return console.error(err.message);
            }
            else {
            res.send('Thanks for signing up! ' + req.body.firstname + req.body.surname + 'Your username is: ' + req.body.username);
            }
        });
    });

    //-----------------------------------------------------------------------
    app.get('/signin',function(req,res){
        res.render('signin.ejs', forumData);
    });

    app.post('/signedin', function (req,res) {
        // query database for information matching user input
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
            // query database to get topics the user has joined
            sqlquery = `SELECT t.topic_id
                        FROM topic t
                        LEFT JOIN participant p
                        ON t.topic_id = p.topic_id
                        WHERE p.user_id = ?`;
            db.query(sqlquery, [req.session.user.id], (err, result) => {
                if (err) {
                    res.redirect('./');
                    return console.error(err.message);
                }

                req.session.user.topics = result;
                req.session.save();
                console.log(req.session.user);
            });
           
            res.redirect('./');
        });

        app.get('/logout', function(req, res) {
            req.session.destroy();
            res.redirect('./');
        });
    });
}