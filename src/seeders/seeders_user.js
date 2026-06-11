'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      email: 'nhuhuynhdang.191203@gmail.com',
      password: '123456',
      firstName: 'Huynh',
      lastName: 'Dang',
      address: 'TPHCM',
      gender: 0,
      typeRole:'ROLE',
      roleID:'R1',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
