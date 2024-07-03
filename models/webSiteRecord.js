module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("webSiteRecord", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		description: {
			type: DataTypes.TEXT,
			defaultValue: null,
		},
		companyLogo: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		facebookUrl: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		twitterUrl: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		instagramUrl: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		linkedInUrl: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		address: {
			type: DataTypes.STRING(255),
			defaultValue: null
		},
		phoneNumber: {
			type: DataTypes.STRING(14),
			defaultValue: null
		},
		email: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		}
	}, { tableName: "webSiteRecord" }
	);
};
