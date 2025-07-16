const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require("mongoose");

const corsOptions = {
    origin : "http://localhost:4200",
    credentials: true
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.use("/uploads", express.static('uploads'));


require("./routes/upload.route")(app)

const port = 8000;
app.listen(port, ()=>{
    console.log(`server stared on port ${port}`)
})

// To connect to the databse
mongoose.connect('mongodb://127.0.0.1:27017/interview' );
const DB = mongoose.connection;
DB.on("error", () => {
  console.log("Error while connecting to the database");
});
DB.once("open", () => {
  console.log("Successfully connected to the database");
});