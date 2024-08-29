const mongoose = require("mongoose");
const initialdata = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("Connected to Data Base");
})
.catch(err =>{
    console.log(err)
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
};


const insertdata = async()=>{

   await Listing.deleteMany({});
   initialdata.data = initialdata.data.map((obj)=>({...obj, owner:"65c28a50f8be8bfa341aa656"}));
   await Listing.insertMany(initialdata.data);
   console.log("Data was initialised");

};

insertdata();




























