const express = require('express')
const { google } = require('googleapis')
const twilio = require('twilio')
const { searchconsole } = require('googleapis/build/src/apis/searchconsole')
require('dotenv').config()
const customSearch = google.customsearch('v1')

const MessagingResponse = twilio.twiml.MessagingResponse

const app = express()

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



app.use(express.urlencoded({
    extended:false
}))
app.use(express.json())


app.get('/', (req, res) => {
    res.send('hie i am charles madhuku')

    customSearch.cse.list(
        {
            auth: process.env.API_KEY,
            cx: process.env.SEARCH,
            q: 'javascript',
        num:10,
        }
    ).then(result => result.data).
        then(result => console.log(result))
})

app.post('/bot', (req, res) => {
    const twiml = new MessagingResponse()
    console.log(req.body)
     twiml.message('hie')
    let messageBody = req.body.Body
    let messageNumber = req.body.From
    let profileName = req.body.ProfileName

    if (messageBody == 'Hi') {
         twiml.message('hie')
    }
   
})

app.listen(3000, ()=> console.log("Server started on 3000"))