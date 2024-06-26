module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Applications', {
      userId: {
        allowNull: false,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'cascade',
        type: Sequelize.INTEGER,
      },
      jobId: {
        allowNull: false,
        primaryKey: true,
        references: { model: 'jobs', key: 'id' },
        onDelete: 'cascade',
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Applications')
  }
}
