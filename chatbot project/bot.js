const express = require('express')
const twilio = require('twilio')
const { Paynow } = require('paynow')
const dotenv = require('dotenv').config()
const crypto = require('crypto')
const schemasModel = require('./schema')
const router = express.Router()
const messageResponses = require('./Response.json')
const register = require('./options/register')
const regMatch = /^[a-zA-Z\s]+$/
const regNum = /^[0-9]+$/
var regMoney  = /^\d+(?:\.\d{0,2})$/;


// load env variables
const {
    PAYNOWID: paynowId,
    PAYNOWKEY:paynowkey
} = process.env
// twilio
const MessagingResponse = twilio.twiml.MessagingResponse

// instance of paynow
let paynow = new Paynow(paynowId,paynowkey)
const numberDatabase = [];
const welcomeMessage = ['hi', 'hie', 'hey', 'hello']


router.post('/', async (req, res) => {
    
    const twiml = new MessagingResponse()
    let messageBody = req.body.Body
    let messageNumber = req.body.From
    let profileName = req.body.ProfileName
    
    let breakMessages = messageBody.split(',')
    let option = breakMessages[0].toLowerCase()
    console.log(option)

    if (!numberDatabase.includes(messageNumber)) {
        twiml.message(`Hie ${profileName}${messageResponses.welcomeMessage}`)
        numberDatabase.push(messageNumber)
       } else {
        if (welcomeMessage.includes(messageBody.toLowerCase())) {
           twiml.message(`Hie ${profileName}${messageResponses.welcomeMessage}`)
        } else if (messageBody == '1') {
            twiml.message(`Hie ${profileName}${messageResponses.RegMessage}`)
        } else if (messageBody == '2') {

           twiml.message(`Hie ${profileName}${messageResponses.DepMessage}`)
        } else if (messageBody == '3') {
            twiml.message(`Hie ${profileName}${messageResponses.GetTodayFixure}`)
        } else if (messageBody == '4') {
            twiml.message(`Hie ${profileName}${messageResponses.GetPdfFixture}`)
        } else if (messageBody == '5') {
            twiml.message(`Hie ${profileName}${messageResponses.GetFixtureByleague}`)
        } else if (messageBody == '6') {
            twiml.message(`hie ${profileName}${messageResponses.GetFixturebyDate}`)
        } else if (messageBody == '7') {
            twiml.message(`Hie ${profileName}${messageResponses.CreateTicket}`)
        } else if (messageBody == '8') {
            twiml.message(`Hie ${profileName}${messageResponses.CheckTicket}`)
        } else if (messageBody == '9') {
            twiml.message(`Hie ${profileName}${messageResponses.DeleteTicket}`)
        } else if (messageBody == '10') {
            twiml.message(`Hie ${profileName}${messageResponses.TransferStack}`)
        } else if (messageBody == '11') {
            twiml.message(`Hie ${profileName}${messageResponses.Withdraw}`)
        } else if (messageBody == '12') {
            twiml.message(`Hie ${profileName}${messageResponses.MyAccount}`)
        } else if (messageBody == '13') {
            twiml.message(`Hie ${profileName}${messageResponses.AvailableOptions}`)
        } else if (messageBody == '14') {
            twiml.message(`Hie ${profileName}${messageResponses.PaymentsNumbers}`)
        } else if (messageBody == '15') {
            twiml.message(`Hie ${profileName}${messageResponses.Results}`)
        } else if (option == 'reg') {
             let name = breakMessages[1].replace(/\s+/g, '') || null
    let phonenumber = breakMessages[2].replace(/\s+/g, '') || null
    let agentcode = breakMessages[3].replace(/\s+/g, '') || null
            

            if (regMatch.test(name)) {
                if (regNum.test(phonenumber)) {
                    console.log('num true')
                    if (phonenumber.length == 10) {
                        console.log('num full')
                        if (agentcode != null) {
                            console.log(agentcode,'ok')
                            const id = crypto.randomBytes(2).toString("hex")
                            const datas = await schemasModel.User.find({ "phonenumber": phonenumber }).exec()
                            const ids = await schemasModel.User.find({ "username": `MC${id}` })
                            console.log(datas)
                             console.log('gh')
                            if (datas.length == 0) {
                                if (ids.length == 0) {
                                 const user = {
                                "name": name,
                                "phonenumber": phonenumber,
                                "username": `MC${id}`,
                                     "agentcode": agentcode,
                                
                            }
                                    const data = schemasModel.User(user)
                                   
                            
                            try {
                                await data.save()
                                twiml.message(`*Rocket Bet*\n\n*Congratulation! Your registration is complete*\n\n Your  Username is MC${id}\n\nNote Your default password is your username* Do not open it on behalf of your friends`)
                            } catch (error) {
                                 twiml.message(`Hie ${profileName}\n\n *Please note that your registration has failed. Please use the format below*${messageResponses.ExampleFormat}`)
                            }
                                } else {
                                     twiml.message(`Hie ${profileName}\n\n*Please note that your registration has failed*. *Please use the format below*${messageResponses.ExampleFormat}`)
                                }
                                
                            } else {
                                 twiml.message(`Hie ${profileName}\n\n *Please note that your registration has failed. Phone number has already been registered*${messageResponses.ExampleFormat}`)
                            }
                          
                            
                        } else {
                             twiml.message(`Hie ${profileName}\n\n *Invalid phones format*${messageResponses.ExampleFormat}`)
                        }
                        
                    } else {
                         twiml.message(`Hie ${profileName}\n\n *Invalid phoned format*${messageResponses.ExampleFormat}`)
                    }
                    
                } else {
                     twiml.message(`Hie ${profileName}\n\n *Invalid phone format*${messageResponses.ExampleFormat}`)
                }               
            } else {
                twiml.message(`Hie ${profileName}\n\n *Invalid name format*${messageResponses.ExampleFormat}`)
            }
        } else if (option == 'payment') {
            // option 2 deposit of money into the account
            let username = breakMessages[1] || null
            let confirmation = breakMessages[2] || null
            const ids = await schemasModel.User.find({ "username": `${username}` }) 
            if (ids.length == 1) {
                if (confirmation) {
                    twiml.message(`Hie ${profileName}\n\n Processing Your deposit`)
                    const depositdata = {
                        username: username,
                        confirmationMessage: confirmation,
                        depositedAt:new Date()
                    }
                    const data = schemasModel.deposits(depositdata)
                    try {
                        await data.save()
                        twiml.message(`Hie ${profileName}\n\nSucessfully Processed your deposit now awaiting approval. Thank you very much `)
                    } catch (error) {
                        twiml.message(`Hie ${profileName}\n\nSorry your deposit has been revoked please try again`)
                    }

                    
                } else {
                    twiml.message(`Hie ${profileName}\n\n*Please sent confirmation message*`)
                }
            } else {
                twiml.message(`Hie ${profileName}\n\n*NO User with that username please register*`)
            }
           
           
             
        } else if (option == 'a') {
            let username = breakMessages[1].replace(/\s+/g, '') || null
            let phoneNumber = breakMessages[2].replace(/\s+/g, '') || null

            let accountDetails = await schemasModel.User.find({ username: username, phonenumber: phoneNumber })
            console.log(accountDetails)
            if (accountDetails.length == 1) {
                let depostDetails = await schemasModel.deposits.find({ username: username })
                console.log(accountDetails[0].name)
                let accMessage = `*Username: ${accountDetails[0].username}*\n*Fullname: ${accountDetails[0].name}*\n*Phone Number: ${accountDetails[0].phonenumber}*\n\n*Balance: ${accountDetails[0].balance}*`
                twiml.message(`Hie ${profileName}\nYour Account\n\n${accMessage}`)
            } else {
                twiml.message(`Hie ${profileName} cant find account with that details`)
            }


        }
        else {
             twiml.message(`Hie ${profileName}${messageResponses.IncorrectMessage}`)
        }
       
    }

    console.log(numberDatabase)
    console.log(messageBody , messageNumber, profileName)
   
    //twiml.message('hie i am a bot made \n by*charlesmadhuku*')
    res.writeHead(200, {'Content-Type': 'text/xml' })
    res.end(twiml.toString())
})

module.exports = router
