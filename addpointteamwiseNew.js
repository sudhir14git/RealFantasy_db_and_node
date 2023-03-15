"use strict";
require('dotenv').config()
const axios = require("axios");
const mysql_pool = require('./db');
const ApibaseUrl = require('./db');
const cron = require('node-cron');
const matchTypeList = require('./db');
const MatchProcess = require('./models/processmatches');


let tatalRecord = (playerId, matchId, connection, totalPoint, iscap, isvcap,matchType) => {
    return new Promise(async function (resolve, reject) {

        let query1 = 'select * from matchplrptstotal where pid  = "' + playerId + '" AND matchid = "' + matchId + '"';
        
        connection.query(query1, async function (error, results, fields) {
          try{
            if (error) {
                console.log(new Date())
                console.log("connection down at", error);
              } else if (results.length > 0) {
              let api_url = (ApibaseUrl.ApibaseUrl.baseUrl) + "/getglobalpoints";
              var response = await axios.post(api_url, {
                  gametype: 'cricket'
              });
              console.log("response---->>",response.data.data);
              
              if (response) {
                
                  // let fantasypoints = response.data.data.cricket[matchType];
                  
                  let fantasypoints = response.data.data.cricket[matchType]
                  let playerTotalPoint = (iscap == 1) ? (parseFloat(results[0].total) * parseFloat(fantasypoints["cap"])) : (isvcap == 1) ? (parseFloat(results[0].total) * parseFloat(fantasypoints["vcap"])) : parseFloat(results[0].total)
                  console.log("playerTotalPoint---->>>", playerTotalPoint);
                resolve(playerTotalPoint);
             }
            } else {
                resolve(0);
                console.log("there are not matching match Id");
            }
          }catch(e){
            console.log("error===>",e);
          }
        })

    })
}
var updatePoints = (totalPoint, teamid, connection) => {
    return new Promise(function (resolve, reject) {
        let query2 = 'update  joincontests set ptotal = "' + totalPoint + '" where uteamid = "' + teamid + '"';

        connection.query(query2, function (error, results, fields) {
            if (error) {
                console.log(new Date())
                console.log("connection down at", error);
            } else if (results) {
                resolve(results);
            }
        })
    })
}
var saveNewmatches = async (req, res) => {
    try {
        (mysql_pool.mysql_pool).getConnection(async function (err, connection) {
            try {
                if (err) {
                    console.log(' Error getting mysql_pool connection: ' + err);
                } else {
                    //let matchidUrl = (ApibaseUrl.ApibaseUrl.baseUrl) + '/getlivematches';
                    //var matchidarr = await axios.post(matchidUrl);
                    MatchProcess.find({"pointteamstatus":0,"gameid":1}, async function (errormatchidarr, matchidarr, fieldsmatchidarr) {
                        if (matchidarr && matchidarr.length>0) {
                            //let matchArr = matchidarr.data.data;
                            let matchArr = matchidarr;
                            if (matchArr) {
                                console.log("matchidarrmatchidarrmatchidarrmatchidarr", matchArr.length)
                                for (let l = 0; l < matchArr.length; l++) {
                                    let matchId = matchArr[l].matchid

                                    ///////
                                    if(matchArr[l].mongosavestatus===1 && matchArr[l].plyrfntyptstatus===1)
                                    {
                                        MatchProcess.updateOne({"matchid":matchId},{"$set":{"pointteamstatus":1}},function(eeee,rrr){
                                        });
                                    }
                                    //////////
                                    /*
                                    console.log("ApibaseUrl.ApibaseUrl.baseUrl--->>",ApibaseUrl.ApibaseUrl.baseUrl);
                                    let api_url = (ApibaseUrl.ApibaseUrl.baseUrl) + '/getcontestteamandplayernode';
                                    var response = await axios.post(api_url, {
                                        "matchid": matchId
                                    });*/
                                    //console.log("api_url--->>>",api_url);

                                    let queryMatchType = "SELECT mtype FROM matches WHERE matchid='"+matchId+"'";

                                    connection.query(queryMatchType, function (errorMatchType, resultMatchType) {
                            //////////////////
                                    

                                    let queryTeamList = "SELECT jc.uteamid,jc.matchid FROM joincontests jc INNER JOIN userteams ut"
                                    +" ON jc.uteamid=ut.id WHERE jc.matchid='"+matchId+"' GROUP BY jc.uteamid";

                                    connection.query(queryTeamList, function (errorTeamList, resultTeamList) {
                                    if(resultTeamList && resultTeamList.length>0){

                                            let typeObject = matchTypeList.matchType;
                                            //console.log("response.data--->>>",response.data)
                                            let result = resultTeamList; //response.data.data;
                                            //let details = response.data.details;
                                            let matchType = (resultMatchType && resultMatchType.length>0)?resultMatchType[0].mtype:""; //typeObject[details.mtype]
                                            let smatchType =ApibaseUrl.matchType[matchType];
                                            if (result){
                                                


                                                for (let i = 0; i < result.length; i++) {

                                                    let teamid = result[i].uteamid;
                                                let queryPlayerList = "SELECT pid,iscap,isvcap FROM userteamplayers WHERE userteamid="+teamid;

                                    connection.query(queryPlayerList, function (errorPlayerList, resultPlayerList) {
                                                    
                                                    let matchid = matchId; //result[i].matchid;
 

                                                    let playerArr = (resultPlayerList && resultPlayerList.length)?resultPlayerList:[]; //result[i].players;
                                                    let totalPoint = 0;
                                                    let k = 1;
                                                    for (let j = 0; j < playerArr.length; j++) {
                                                        let iscap = playerArr[j].iscap;
                                                        let isvcap = playerArr[j].isvcap;
                                                        tatalRecord(playerArr[j].pid, matchid, connection, totalPoint, iscap, isvcap,smatchType).then(data => {
                                                            console.log("-----",i, parseFloat(data))
                                                            totalPoint = totalPoint + parseFloat(data);

                                                            if (playerArr.length == k) {
                                                                console.log("totalPointtotalPointtotalPoint--", totalPoint)
                                                                updatePoints(totalPoint, teamid, connection).then(res => {
                                                                    console.log("update suscessfully");
                                                                }).catch(e => {
                                                                    console.log("there are the error", e);
                                                                })
                                                            }
                                                            k++;
                                                        }).catch(e => {
                                                            console.log("there are the error", e);
                                                        })
                                                    }
                                                    
                                                
                                                })
                                                }
                                           
                                            }

                                            ///////
                                        
                                        
                                    }

                                })


                                })

                                    /*
                                    if (response && response.data && response.data.error==false) {
                                        let typeObject = matchTypeList.matchType;
                                        console.log("response.data--->>>",response.data)
                                        let result = response.data.data;
                                        let details = response.data.details;
                                        let matchType =  typeObject[details.mtype]
                                        console.log("matchType ===-----",details.mtype);
                                        // mtype
                                        console.log("resultresult", JSON.stringify(result))
                                        if (result){


                                            for (let i = 0; i < result.length; i++) {
                                                let teamid = result[i].uteamid;
                                                let matchid = result[i].matchid;
                                                let playerArr = result[i].players;
                                                let totalPoint = 0;
                                                let k = 1;
                                                for (let j = 0; j < playerArr.length; j++) {
                                                    let iscap = playerArr[j].iscap;
                                                    let isvcap = playerArr[j].isvcap;
                                                    tatalRecord(playerArr[j].pid, matchid, connection, totalPoint, iscap, isvcap,matchType).then(data => {
                                                        console.log("-----", parseFloat(data))
                                                        totalPoint = totalPoint + parseFloat(data);

                                                        if (playerArr.length == k) {
                                                            console.log("totalPointtotalPointtotalPoint--", totalPoint)
                                                            updatePoints(totalPoint, teamid, connection).then(res => {
                                                                console.log("update suscessfully");
                                                            }).catch(e => {
                                                                console.log("there are the error", e);
                                                            })
                                                        }
                                                        k++;
                                                    }).catch(e => {
                                                        console.log("there are the error", e);
                                                    })
                                                }
                                            }
                                        }

                                        ///////
                                    }
                                    */
                                }
                            } else {
                                console.log("Active match id not found 1");
                            }
                        } else {
                            console.log("Active match id not found 2");
                        }
                    })
                }
                connection.release();
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