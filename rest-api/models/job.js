const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId' })
      this.belongsToMany(models.User, { through: 'Applications', as: 'Applicant', foreignKey: 'userId' })
    }
  }

  Job.init({
    company: DataTypes.STRING,
    position: DataTypes.STRING,
    description: DataTypes.TEXT,
    salaryFrom: DataTypes.INTEGER,
    salaryTo: DataTypes.INTEGER,
    type: DataTypes.STRING,
    city: DataTypes.STRING,
    homeOffice: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Job',
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    },
  })

  return Job
}