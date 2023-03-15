"use strict";
require('dotenv').config()
const axios = require("axios");
const mysql_pool = require('./db');
const ApibaseUrl = require('./db');
const cron = require('node-cron');
const matchTypeList = require('./db');
const MatchProcess = require('./models/processmatches');


var saveNewmatches = async (req, res) => {
    try {
        (mysql_pool.mysql_pool).getConnection(async function (err, connection) {
            try {
                if (err) {
                    console.log(' Error getting mysql_pool connection: ' + err);
                } else {
                    let queryTeamList = "SELECT * FROM matches where mstatus!='cl'";
                                   await connection.query(queryTeamList,async function (errorTeamList, resultTeamList) {
                                        resultTeamList.forEach(async(item,index)=>{
                                            
                                          await  MatchProcess.findOne({"matchid":item.matchid}, async function (errormatchidarr, matchidarr, fieldsmatchidarr) {
                                                console.log("matchidarr---->>>",item.matchid);
                                            if (matchidarr==null) {
                                                    let mdate = parseInt(item.mdate);
                                                    let reqmdate=new Date(mdate*1000);
                                                    let date = new Date / 1000 | 0;
                                                    if(mdate <= date){
                                                        let objMatchDetails={
                                                            'matchid':  item.matchid,
                                                            'mstatus': '',
                                                            'mdate':  reqmdate,
                                                            'team1':  item.team1,
                                                            'team2':  item.team2,
                                                            'plyrfntyptstatus':(item.mstatus==="li")?0:1,
                                                            'mongosavestatus':  0,
                                                            'filesavestatus':  0,
                                                            'pointstatus':  0,
                                                            'pointteamstatus':  (item.mstatus==="li")?0:1,
                                                            'ppointstatus':  0,
                                                            'seriesid':  item.seriesid,
                                                            'gameid':  item.gameid,
                                                            'domesticstatus':  0
                                                        }
                                                            await MatchProcess.create(objMatchDetails,function(eeee,rrr){
                                                            if(eeee)
                                                            {
                                                                console.log("eeee--->>",eeee);
                                                            }
                                                        });
                                                    }
                                                }
                                            })
                                        })
                                    })
                    }
                  
                
                //connection.release();
                console.log("connection relese successfully");
            } catch (e) {
                console.log("there are the error---", e);
            }
        })
    } catch (e) {
        console.log("error catch", e);
    }
}

cron.schedule('*/2 * * * *', () => {
    saveNewmatches();
})

saveNewmatches();