const Sequelize = require('sequelize');
require('sqlite3');
var sequelize = new Sequelize('test', null, null, {dialect:'sqlite', storage: 'd:\\temp\\t.db'});

