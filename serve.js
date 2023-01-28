const express = require("express"); //routing stuff
const mongoose = require("mongoose"); //orm interact with mongo
const bodyParser = require("body-parser") //parsing data
const crypto = require("crypto"); //generating string
const dotenv = require("dotenv")
dotenv.config()


const app = express();
const PORT = process.env.PORT || 5050;
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, connectionParams)

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json())

const jsondataSchema = {
    endpoint: String,
    content: Object,
}

const Jsondata = mongoose.model("Json", jsondataSchema)
app.post("/postjson",(req, res)=>{
    const randomString = crypto.randomBytes(4).toString('hex');

    const urlEndpoint = `https://jsonserve.onrender.com/${randomString}`

    const newJson = new Jsondata({
        endpoint: randomString,
        content: req.body
    })
    newJson.save(function (err) {
        if (!err) {
            res.send(urlEndpoint)
        } else {
            res.send(err)
        }
    })
})
app.get("/:param", (req, res)=>{
    console.log(req.params)
    const endpoint = req.params.param
    Jsondata.findOne({endpoint: endpoint}, function (err, data) {
        if (data) {
            res.send(data.content);
        } else {
            res.send("Something Went Wrong, check the endpoint and try again...")
        }
    })
})

app.listen(PORT,()=>{
    console.log(`Server Listening at port ${PORT}`);
})