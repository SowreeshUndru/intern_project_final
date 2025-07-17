
const mongoose=require("mongoose");


function connect(){

    mongoose.connect(process.env.MONGODB_URI)
    .then((result) => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    }); 

}
module.exports=connect;
