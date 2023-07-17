'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const category = [
      { name: 'Artificial Intelligence'},
      { name: 'Business' },
      { name: 'Money' },
      { name: 'Technology' }
    ];
    await queryInterface.bulkInsert('category', category, {});
  },

  async down (queryInterface, Sequelize) {
  }
};
