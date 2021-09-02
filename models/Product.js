'use strict';
module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("Product", {
    // id: {
    //   type: Sequelize.INTEGER,
    //   primaryKey: true,
    //   allowNull: false,
    //   autoIncrement: true
    // },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,

    },
    units: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false}
);

  Product.associate = (models) => {
    Product.belongsTo(models.Brand, {
      foreignKey: 'brandId',
    });
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
    });
    Product.hasMany(models.Spect, {
      foreignKey: 'productId',
    });
    // Product.belongsTo(models.Spect, {
    //   foreignKey: 'spectId',
    // });
  };


  return Product;
};
