var express        = require("express"), 
    methodOverride = require("method-override"),
    bodyParser     = require("body-parser"), 
    expressSanitizer = require("express-sanitizer"),
    mongoose       = require("mongoose"),
    
    // config
    
    app = express(); 
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));
    app.set("view engine", "ejs"); 
    
    mongoose.connect("mongodb://localhost/restFull_app");
    
    var blogSchema = new mongoose.Schema({
        title: String,
        image: String, 
        body: String, 
        created: {type: Date, default: Date.now()}
    });
    
    var Blog = mongoose.model("Blog", blogSchema);
    
    // Blog.create(
    //     {
    //         title: "Drustvena mreza", 
    //         image: "https://farm2.staticflickr.com/1086/882244782_d067df2717.jpg",
    //         body: "Some of the most popular social network's is: Facebook, Twiter, LinkedIn"
    //     }, function(err, blogs){
    //         if(err){
    //             console.log(err);
    //         } else {
    //             console.log(blogs); 
    //         }
    //     });
    
app.get("/", function(req, res){
    res.redirect("/blogs")
});
    
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, allBlogs){
        if(err){
            console.log(err);
        } else {
           res.render("index", {blogs: allBlogs}); 
        }
    });
});
    
// new route

app.get("/blogs/new", function(req, res){
    res.render("new");
});

// create route

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

// show route

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// edit route 

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, editBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("edit", {blog: editBlog})
       }
    });
});


// update route 

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// delete route

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});


    
    
    
    
    
    
    
    
    app.listen(process.env.PORT, process.env.IP, function(){
        console.log("Server is running!")
    });
    
