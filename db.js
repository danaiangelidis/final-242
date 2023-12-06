const mongoose = require("mongoose");

const startMongo = async () => {
    mongoose.connect(
        "mongodb+srv://angelidisdanai:ufkBvXlteDvPQKpT@assignment17.fdmsu3p.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => console.log("Connected to MongoDB!"))
    .catch((error) => console.error("Could not connect to MongoDB...", error));
};

module.exports = startMongo;
