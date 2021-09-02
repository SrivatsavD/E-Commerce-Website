'use strict';
module.exports = (sequelize, Sequelize) => {
  const OrderItems = sequelize.define("OrderItem", {
    qty: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    totalAmount: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  OrderItems.associate = (models) => {
    OrderItems.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false
      },
    });
    OrderItems.belongsTo(models.Order, {
      foreignKey: {
        name: 'orderId',
        allowNull: false
      },
    });
  };

  return OrderItems;
};
