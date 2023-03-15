"use strict";
require('dotenv').config();
const cron = require('node-cron');
const CompleteMatch = require('./completematch.js');
const ApibaseUrl = require('./db');
const axios = require("axios");

async function refundAmount() {
    try {
        
        CompleteMatch.findOne({ "status" : "completed","status_overview" : "abandoned","ismatchcancel": {"$ne":1}}, async function (errormatchidarr, resultMP, fieldsmatchidarr) {
            if (resultMP && resultMP.matchid) {
                let api_url =(ApibaseUrl.ApibaseUrl.baseUrl)+"/nodecancelmatch";
                var response = await axios.post(api_url,{"matchid":resultMP.matchid});
                if (response) {
                    //console.log("response---->>",response)
                    CompleteMatch.updateOne({"matchid":resultMP.matchid},{"$set":{"ismatchcancel": 1}},function(eeee,rrr){
                    });
                }
            }
        })

    } catch (error) {
        console.log("error   ", error);
    }
};

console.log("S=", new Date())
cron.schedule('*/10 * * * *', () => {
    console.log("E=", new Date())
    refundAmount();
})
refundAmount();
