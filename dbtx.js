const mysql2 = require('mysql2/promise');
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
var teamlogourl='';


if(process.env.VALUE_ENEV == 'dev'){
  // my sql db connection details
  connectionLimit = 10;
  host = '127.0.0.1';
  user = 'dbuser';
  password = '22F64n-3t66ln';
  database ='realfan';
}
else {
  // my sql connection details
  connectionLimit = 10;
  host = '127.0.0.1';
  user = 'dbuser';
  password = '22F64n-3t66ln';
  database ='realfan';
}

const connConfig = mysql2.createPool({
	connectionLimit: 1000,
	host: host,
	user: user,
	password: password,
	database: database,
	multipleStatements:true
});
module.exports = connConfig;
