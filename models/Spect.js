'use strict';
module.exports = (sequelize, Sequelize) => {
  const Spects = sequelize.define("Spect", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
      //primaryKey: true
    },
    value: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  },
  { timestamps: false}
  );

  Spects.associate = (models) => {
    Spects.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false
      },
    });
  };

  return Spects;
};
