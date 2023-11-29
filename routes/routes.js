module.exports = function(app, forumData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', forumData)
    });

}