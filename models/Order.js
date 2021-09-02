'use strict';
module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("Order", {
    qty: {
      type: Sequelize.INTEGER,
      //primaryKey: true,
      allowNull: false,
    },
    totalAmount: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, {
      foreignKey: {
        name: 'orderId',
        allowNull: false
      },
      as: 'Order Items'
    });
  };

  return Order;
};
