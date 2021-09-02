'use strict';
module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("Category", {
    // id: {
    //   type: Sequelize.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true
    // },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { timestamps: false}
);

  return Category;
};
