var Sequelize = require("sequelize");
var sequelize = require("../dbConnection").sequelize;
module.exports = {
	webSiteRecord: require("./webSiteRecord")(Sequelize, sequelize, Sequelize.DataTypes)
};