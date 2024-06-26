const { Model } = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Experience, { foreignKey: 'userId' })
      this.hasMany(models.Job, { foreignKey: 'userId' })
      this.belongsToMany(models.Job, { through: 'Applications', as: 'Applicant', foreignKey: 'jobId' })
    }

    comparePassword(password) {
      return bcrypt.compareSync(password, this.password)
    }

    toJSON() {
      const userData = this.get()
      if (userData.hasOwnProperty('password')) {
        delete userData.password
      }
      return userData
    }
  }

  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fullName: DataTypes.STRING,
    role: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    },
    hooks: {
      beforeCreate: user => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(11))
      },
    },
  })

  return User
}