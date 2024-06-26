const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Experience extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }

  Experience.init({
    company: DataTypes.STRING,
    title: DataTypes.STRING,
    interval: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Experience',
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    },
  })

  return Experience
}