const mysql = require('mysql');
const mongoose = require('mongoose');
let connectionLimit = '';
let host = '';
let user = '';
let password = '';
let database = '';
let baseUrl  = '';
let imageUrl = ';'
let userName = ''
let mongoPassword = '';
let databaseName =  '';
let mongoAddress =  '';
let mongoPort    =  '';
let poolSize    = 0;
var scoreurl="";

cricktoken ='iOSnsZbuhgMXyy5gSL4N4kzDGGC3';

console.log("process.env.VALUE_ENEV=",process.env.VALUE_ENEV);

if(process.env.VALUE_ENEV == 'dev'){
  // my sql db connection details
  connectionLimit = 10;
  host = '127.0.0.1';
  user = 'dbuser';
  password = '22F64n-3t66ln';
  database ='realfan';

 //mongo conection
 mongoUser     = "dbuser";
 mongoPassword = "RL*874Bba7-Bv";
 mongoDatabase = "realfan";
 mongoAddress  = "127.0.0.1",
 mongoPort     =  27017;
 poolSize      =  4;
}else 
  {
  // my sql db connection details
  connectionLimit = 10;
  host = '127.0.0.1';
  user = 'dbuser';
  password = '22F64n-3t66ln';
  database ='realfan';

 //mongo conection
 mongoUser     = "dbuser";
 mongoPassword = "RL*874Bba7-Bv";
 mongoDatabase = "realfan";
 mongoAddress  = "127.0.0.1",
 mongoPort     =  27017;
 poolSize      =  4;
}

// my sql connection pool
var mysql_pool = mysql.createPool({
  connectionLimit : connectionLimit,
  host: host,
  user: user,
  password: password,
  database: database
});


// mongo db connection pool

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://'+mongoUser+':'+mongoPassword+'@'+mongoAddress+':'+mongoPort+'/'+mongoDatabase+'?poolSize=4',  { useNewUrlParser: true } )
    .then(() => {
        console.log("database is connected");
    }).catch(err => console.error(err));



if(process.env.VALUE_ENEV == 'dev'){
  baseUrl  =   'https://www.realfantasy11.com/realfantasy11/public' 
  imageUrl  =  'https://www.realfantasy11.com/realfantasy11/public/uploads/teamlogo/'
  teamlogourl="https://www.realfantasy11.com/realfantasy11/public/uploads/teamlogo/";
  global.locationRedirect="http://localhost:3882/#/PaytmResponse/";
  scoreurl="https://score.realfantasy11.com";
  global.NEWCRICKETAPI="http://139.162.12.44:3000";
  global.PRODUCTNAME="Real Fantasy11";
  global.DRAWGENERATORAPI="https://www.realfantasy11.com/realfantasy11/public/draw/cron";
  global.MAILSYSTEM={
    MatchStartNew_getuserdfeequery:true,
    poolpriceset_payWinTDS:true,
    poolpricesetwindistributemanual_payWinTDS:true
  };
  global.lineUpPath="F:/BRSoftech/realfantasy11/realfantasynodecron/fixture.json";
  global.CANCEL_POOL_BELOW_PER=80;
}
else {
    baseUrl  =   'https://www.realfantasy11.com/realfantasy11/public'
    imageUrl  =  'https://www.realfantasy11.com/realfantasy11/public/uploads/teamlogo/'
    teamlogourl="https://www.realfantasy11.com/realfantasy11/public/uploads/teamlogo/";
    global.locationRedirect="https://play.realfantasy11.com/#/PaytmResponse/";
    scoreurl="https://score.realfantasy11.com";
    global.NEWCRICKETAPI="http://139.162.12.44:3000";
    global.PRODUCTNAME="Real Fantasy11";
    global.DRAWGENERATORAPI="https://www.realfantasy11.com/realfantasy11/public/draw/cron";
    global.MAILSYSTEM={
      MatchStartNew_getuserdfeequery:true,
      poolpriceset_payWinTDS:true,
      poolpricesetwindistributemanual_payWinTDS:true
    };
    global.lineUpPath="/var/www/html/realfantasy11/src/settings/fixture.json";
    global.CANCEL_POOL_BELOW_PER=80;
}
var ApibaseUrl  = {
  baseUrl : baseUrl,
  scoreurl:scoreurl
}
var matchType = new Object();
  matchType["WomensODI"]   =  'ODI';
  matchType["YouthODI"]    =  'ODI';
  matchType["T20I"]        =  'Twenty20';
  matchType["Twenty20"]    =  'Twenty20';
  matchType["ListA"]       =  'ODI';
  matchType["WomensT20I"]  =  'Twenty20';
  matchType["ODI"]         =  'ODI';
  matchType["First-class"] =  'Test';
  matchType["Test"]        =  'Test';
  
  matchType["t10"]        =  'T10';
  matchType["t20"]        =  'Twenty20';
  matchType["one-day"]    =  'ODI';
  matchType["test"]       =  'Test';
  matchType["kabaddi"]    =  'kabaddi';
module.exports = {
  mysql_pool,
  ApibaseUrl,
  imageUrl,
  matchType
}
