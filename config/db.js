const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');


const DBconnection = async ()=>{
    try{
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true
        });

    console.log('MongoDB connected ...');

    }catch(err){
        console.log('Error occured when connecting to the database', err);
        process.exit(1);
        
    }
}

module.exports = DBconnection;
