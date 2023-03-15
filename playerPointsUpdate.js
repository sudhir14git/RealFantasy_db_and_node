"use strict";
require('dotenv').config()
const axios = require("axios");
const cron = require('node-cron');
const PlayerPoints = require('./models/playerpoints');
const MatchProcess = require('./models/processmatches');
const connConfig = require('./dbtx');
const connConfig1 = require('./db');

let getMatchPlayers =async () => {
    
    const connection = await connConfig.getConnection();
    
    try {
        //await connection.beginTransaction();
        let matchId='iplt20s2_2020_g21';
        let querySelect = "select * from matchmeta where matchid='"+matchId+"'";
       await connection.query(querySelect,async function (error, results, fields) {
            if (error) {
                console.log("error ===>", error);
                //resolve(false);
            }else{
                await  results.forEach(async(item,index)=>{
                    ///////////
                   await PlayerPoints.aggregate([{"$match":{"seriesid":"iplt20s2_2020","pid":item.pid}},
                        {"$group":{"_id":{"pid":"$pid"},'pid': { '$first': '$pid' },"totalpoints":{"$sum": "$totalpoints"}}}],async function (errr, ress) {
                            console.log("ress------------>>>",JSON.stringify(ress));
                            if(errr)
                            {
                                //console.log("===>>>", errr);
                            }else{
                                let totalpoints=(ress && ress.length>0?ress[0]["totalpoints"]:0);
                                let pids=(ress && ress.length>0?ress[0]["pid"]:"");
                                let updatequery = "update matchmeta set pts='"+totalpoints+"' where matchid='"+matchId+"' and pid='"+pids+"'";
                                console.log("updatequery----->>",updatequery);
                                await connection.query(updatequery, function (error, results, fields) {
                                    if (error) {
                                        console.log("error ===>", error);
                                        //resolve(false);
                                    }
                                })
                            }
                        })
                    //////////            
                })
            }
        })
      
        //await connection.commit();
        //connection.release()
    }
    catch (e) {
        console.log("something went wrong ---->>", e);
        await connection.rollback();connection.release();

    }

}




cron.schedule('*/1 * * * *', () => {
    getMatchPlayers();
});
getMatchPlayers();