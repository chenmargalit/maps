
var monk = require('monk');
var db = monk(process.env.DATABASE_URL, function(err, db){
    if(err){
       console.error("DB is not connected", err.message);
    }
});

module.exports = db;
