const Sequelize = require('sequelize');
const config = new Sequelize("student_database", "Chris", "password", {dialect: 'mysql'});

module.exports = config;