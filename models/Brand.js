'use strict';
module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define("Brand", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { timestamps: false}
);

  return Brand;
};
