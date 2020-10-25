const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();

const MongoServer = async () => {
	try{
		await mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology: true });
		console.log('connected to MongoDB Database');
	}catch(e){
		console.log(e);
		throw e;
	}
};


module.exports = MongoServer;