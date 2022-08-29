const express = require('express')
const twilio = require('twilio')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')



const app = express()
const bot= require('./bot')



// loading enviromental variable
const {
    SID: accountSid,
    KEY: TwilloAuthToken,
    APIKEY: googleApiKey,
    CX: cx,
    DBPASSWORD: dbpassword,
    DBNAME:dbname,
} = process.env
const PORT = process.env.PORT || 3000

twilio(accountSid, TwilloAuthToken)

// connecting mongodb database
mongoose.connect(
     `mongodb+srv://charlie:${dbpassword}@cluster0.j0ffb.mongodb.net/${dbname}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology:true
    }
)

const db = mongoose.connection;

db.on('error', console.error.bind(console,"connection"))
db.once("open", () => {
    console.log("connection successful")
})


app.use(express.urlencoded({
    extended:false
}))
app.use(express.json())
app.use('/bot', bot)
app.get('/', (req, res, next) => {
    res.send('hello charles')
})




app.listen(PORT, ()=> console.log(`app running on Port: http://localhost:${PORT}`))