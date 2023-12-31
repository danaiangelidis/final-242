const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const startMongo = require("./db");
const Joi = require("joi");
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("./user");
let currentUser;
const multer = require("multer");
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

startMongo();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/users", (req, res) => {
    getCurrentUser(res);
});

const getCurrentUser = async (res) => {
    const users = await User.find();
    users.forEach((user) => {
        if(user.username == currentUser.username) {
            res.send(user);
        }
    });
};

app.post("/api/signup", async (req, res) => {
    const result = validateUser(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    if (!(await validateUnique(res, req.body.username))) {
        return;
    }

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.send("success");
});

app.post("/api/login", async (req, res) => {
    const result = validateLoginUser(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const user = await User.findOne({ username: req.body.username });

    if (!user) {
        return res.status(400).send("Username not found!");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).send("Incorrect password!");

    currentUser = user;
    res.send("Success!");
});

app.delete("/api/users/:id", (req, res) => {
    removeUser(res, req.params.id);
});

const removeUser = async (res, id) => {
    const post = await User.findByIdAndDelete(id);
    res.send(post);
};

app.put("/api/users/:id", (req, res) => {
    const resultPass = validatePassword(req.body);

    if (resultPass.error) {
        console.log(resultPass.error.details[0].message);
        return;
    }
    
    updateUser(req, res);
});

const updateUser = async (req, res) => {
    let fieldsToUpdate = {
        password: req.body.password,
    };

    const result = await User.updateOne({ _id: req.params.id }, fieldsToUpdate);
    const user = await User.findById(req.params.id);
    res.send(user);
};

const validateUnique = async (res, username) => {
    const user = await User.findOne({ username: username });

    if (user) {
        res.status(400).send("This user already exists.");
        return false;
    }
    return true;
};

const validatePassword = (user) => {
    const schema = Joi.object({
        password: Joi.string().min(6).required(),
    });

    return schema.validate(user);
};

const validateUser = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(user);
};

const validateLoginUser = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(user);
};
  
const postSchema = new mongoose.Schema ({
    username: String,
    description: String,
    img: String,
    tags: [String],
    comments: [String],
});
  
const Post = mongoose.model("Post", postSchema);

app.get("/api/posts", (req, res) => {
    getPosts(res);
});

const getPosts = async (res) => {
    const posts = await Post.find();
    res.send(posts);
}

app.post("/api/posts", upload.single("img"), (req, res) => {
    const result = validatePost(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const post = new Post ({
        username: currentUser.username,
        description: req.body.description,
        tags: req.body.tags.split(","),
        comments: req.body.comments.split(",")
    });

    if (req.file) {
        post.img = "images/" + req.file.filename;
    }

    createPost(post, res);
});

const createPost = async (post, res) => {
    const result = await post.save();
    res.send(post);
};

app.put("/api/posts/:id", upload.single("img"), (req, res) => {
    const result = validatePost(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updatePost(req, res);
});

const updatePost = async (req, res) => {
    let fieldsToUpdate = {
        username: req.body.username,
        description: req.body.description,
        tags: req.body.tags.split(","),
        comments: req.body.comments.split(",")
    };

    if (req.file) {
        fieldsToUpdate.img = "images/" + req.file.filename;
    }

    const result = await Post.updateOne({ _id: req.params.id }, fieldsToUpdate);
    const post = await Post.findById(req.params.id);
    res.send(post);
};


app.delete("/api/posts/:id", upload.single("img"), (req, res) => {
    removePost(res, req.params.id);
});

const removePost = async (res, id) => {
    const post = await Post.findByIdAndDelete(id);
    res.send(post);
};

const validatePost = (post) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        username: Joi.string().allow("").required(),
        description: Joi.string().min(1).max(1000).required(),
        tags: Joi.allow(""),
        comments: Joi.allow(""),
    });

    return schema.validate(post);
};

app.listen(3000, () => {
    console.log("I'm listening");
});