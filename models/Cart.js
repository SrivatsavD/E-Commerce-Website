'use strict';
module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define("Cart", {
    qty: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'active'
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    totalAmount: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }
);

  Cart.associate = (models) => {
    Cart.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false
      },
    });
  };

  return Cart;
};
