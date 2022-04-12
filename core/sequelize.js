const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

(async () => {
    await sequelize.sync();
})

module.exports = {
    sequelize,
}