
const mongoose=require("mongoose")

//connection creation and creation a new database
mongoose.connect("mongodb://127.0.0.1:27017/saurabh",
 {
     useNewUrlParser: true,
     useUnifiedTopology:true,
     useCreateIndex: true,
   //   useFindAndModify: true
  }).then(()=>{
     console.log(`connection to database established`)
 }).catch((err)=>{
    console.error(`no connection`);
 })