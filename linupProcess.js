"use strict";
require('dotenv').config();
const mysql_pool = require('./db')
const connConfig = require('./dbtx');
const cron = require('node-cron');
const axios = require("axios");
const fs = require("fs");



let updateLinUpSystem=async()=> {
    try {
        //console.log('kkkkkkkkkkkk');
        const conn = await connConfig.getConnection();

        let matchListQuery = "SELECT matchid FROM matches where mstatus='uc'";
        let upcommingMatchList = await conn.query(matchListQuery);
        upcommingMatchList = JSON.parse(JSON.stringify(upcommingMatchList[0]));

        /////////////////////////
        await conn.beginTransaction();
        try {
            let arrayLineUp = [];
            let indexMatchIdNew=0;
            upcommingMatchList.forEach(async (itemMatchId, indexMatchId) => {
                console.log("indexMatchId----->>>",indexMatchId);
                let matchId = itemMatchId.matchid;
                let lineupSatus = 0;

                let api_url = NEWCRICKETAPI + "/matches/matchshortdetail/" + matchId;
                var response = await axios.get(api_url);
                var upcommingmatches = (response && response.data && response.data.match) ? response.data.match : '';//(response && response.match) ? response.match : '';
                //console.log("---------->>",JSON.stringify(upcommingmatches))
                if (upcommingmatches) {
                    let playCheckA_IX = await (upcommingmatches.teams && upcommingmatches.teams.a && upcommingmatches.teams.a.match && upcommingmatches.teams.a.match.playing_xi) ? upcommingmatches.teams.a.match.playing_xi : "";
                    let playCheckB_IX = await (upcommingmatches.teams && upcommingmatches.teams.b && upcommingmatches.teams.b.match && upcommingmatches.teams.b.match.playing_xi) ? upcommingmatches.teams.b.match.playing_xi : "";

                    if (playCheckA_IX && playCheckB_IX) {
                        let playCheckA_IX_string = "";
                        let playCheckB_IX_string = "";
                        let cntplayCheckA_IX = playCheckA_IX.length;
                        let cntplayCheckB_IX = playCheckB_IX.length;
                        for (let i = 0; i < cntplayCheckA_IX; i++) {
                            let item1 = "'" + playCheckA_IX[i] + "'";
                            let comm1 = "";
                            if (i > 0) {
                                comm1 = ",";
                            }
                            playCheckA_IX_string = playCheckA_IX_string + comm1 + item1;
                        }

                        for (let i = 0; i < cntplayCheckB_IX; i++) {
                            let item2 = "'" + playCheckB_IX[i] + "'";
                            let comm2 = "";
                            if (i > 0) {
                                comm2 = ",";
                            }
                            playCheckB_IX_string = playCheckB_IX_string + comm2 + item2;
                        }
                        let combinePlayers =await playCheckA_IX_string + "," + playCheckB_IX_string;
                        
                        let newEntry1 =await Object.assign({}, { "matchid": matchId, "lineup": 1 });
                        await arrayLineUp.push(newEntry1);
                        await indexMatchIdNew++;
                        console.log("mongo-----1------>>>>",upcommingMatchList.length, indexMatchIdNew, matchId,(arrayLineUp));
                        let queryUpdate = "Update matchmeta set isplaying='1' where matchid='" + matchId + "' and pid in (" + combinePlayers + ");Update matchmeta set isplaying='0' where matchid='" + matchId + "' and pid not in (" + combinePlayers + "); Update matches set lineup='1' where matchid='" + matchId + "'";
                        let updateLineUP =await conn.query(queryUpdate);
                        
                    } else {
                        
                        let newEntry2 = Object.assign({}, { "matchid": matchId, "lineup": 0 });
                        await arrayLineUp.push(newEntry2);
                        await indexMatchIdNew++;
                        console.log("mongo-----2------>>>>",upcommingMatchList.length, indexMatchIdNew, matchId,(arrayLineUp));
                    }

                }

                if (upcommingMatchList.length === indexMatchIdNew) {
                    fixtureLineFile(arrayLineUp);
                }
            })
            await conn.commit();
            conn.release();
        } catch (error) {
            console.log("errorerrorerror ", error);

            await conn.rollback(); conn.release();
        }
        /////////////////////////
    } catch (error) {
        console.log("error   ", error);
    }
};



let fixtureLineFile = async (saveData) => {
    try {

        var createStream = await fs.createWriteStream(lineUpPath);
        if (createStream) {
            createStream.write(JSON.stringify(saveData))
            createStream.end();
        }

    } catch (e) {
        console.log("error ==>>", e);
    }
}

cron.schedule('*/1 * * * *', () => {
    updateLinUpSystem();
})

updateLinUpSystem();

