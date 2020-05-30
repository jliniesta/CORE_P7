'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Quizzes', [
      {
        question: 'Capital de España',
        answer: 'Madrid',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: 'Capital de Francia',
        answer: 'París',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: 'Capital de Italia',
        answer: 'Roma',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: 'Capital de Portugal',
        answer: 'Lisboa',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Quizzes', null, {});
  }
};