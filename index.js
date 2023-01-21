const axious = require("axios")
const TelegramBot = require("node-telegram-bot-api")

const chatID = "1091229994"
const token = "5816877612:AAH5tkQsaE9YRvGstp_ttH6_VTqGWVkx8UY"
const bot = new TelegramBot(token, {polling: true})

//each 10 sec check it
const fetchInterval = 10000


bot.onText(/\/checkout/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    // send back the matched "whatever" to the chat
    axious.request({
        url: "https://termine.staedteregion-aachen.de/auslaenderamt/suggest?cnc-191=1&loc=28",
        method: "get",
        headers:{
            Cookie: "TVWebSession=nu3vqeld3f7p2sh6rf5siufh37; cookie_accept=1;"
         }
     }).then(function (response) {
        //handle
        let result = response.data.includes("Kein freier Termin verfügbar")
        //console.log(result)
        if (!result) {
            bot.sendMessage(chatID, "There are available appointments! Check the website!")
        } else {
            bot.sendMessage(chatID, "No free appointments, try later!")
        }
     })

  });


const fetchUrlRecursively = async () => {
    axious.request({
        url: "https://termine.staedteregion-aachen.de/auslaenderamt/suggest?cnc-191=1&loc=28",
        method: "get",
        headers:{
            Cookie: "TVWebSession=nu3vqeld3f7p2sh6rf5siufh37; cookie_accept=1;"
        }
    }).then(function (response) {
        //handle
        let result = response.data.includes("Kein freier Termin verfügbar")
        //console.log(result)
        if (!result) {
            bot.sendMessage(chatID, "There are available appointments! Check the website!")
        }
    })
    setTimeout(() => {
        fetchUrlRecursively()
    }, fetchInterval)
}

//urlsToFetch.forEach((url) => fetchUrlRecursively())
fetchUrlRecursively()

console.log("Service worker started")
console.log(
    `This url will be fetched every ${fetchInterval}ms.`
)