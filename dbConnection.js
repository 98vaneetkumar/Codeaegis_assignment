const Sequelize = require("sequelize");
var sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD, {
		host: process.env.DATABASE_HOST,
		dialect: "mysql",
	}); 
var connectDB = () => {
	sequelize.authenticate()
		.then(() => {
			sequelize.sync({alter:false});
			console.log("Connection has been established successfully.");
		})
		.catch(err => {
			console.error("Unable to connect to the database:", err);
		});
};
module.exports = {
	connectDB: connectDB,
	sequelize: sequelize
};