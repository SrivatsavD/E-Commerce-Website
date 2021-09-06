const db = require("../../models/index.js");

const Op = db.Sequelize.Op;


exports.create = async (createValues, model) => {
  // Validate request
  // if ((model === 'Product'|| model === 'Brand') && !req.body.name) {
  //   res.status(400).send({
  //     message: "Content can not be empty!"
  //   });
  //   return;
  // }
  const Model = db[model];
  const retValue = await Model.create(createValues);
  return retValue;
 };

exports.findOne = (values, model) => {
  // const id = req.params.id;

  const Model = db[model];
  return Model.findOne(values);
  // Brand.findByPk(id)
    // .then(data => {
    //   res.send(data);
    // })
    // .catch(err => {
    //   res.status(500).send({
    //     message: "Error retrieving brand with id=" + id
    //   });
    // });
};

  exports.findAll = ( values, model) => {
    const Model = db[model];
    return Model.findAll(values);
};

exports.findByPk = ( values, model) => {
  const Model = db[model];
  return Model.findByPk(values);
};

exports.findOne = ( values, model) => {
  const Model = db[model];
  return Model.findOne(values);
};

exports.findAndCountAll = ( values, model) => {
  const Model = db[model];
  return Model.findAndCountAll(values);
};

exports.update = ( values, model) => {
  const Model = db[model];
  return Model.update(values);
};

// exports.update = (req, res) => {
//   const id = req.params.id;
//
//   Brand.update(req.body, {
//     where: {id: id}
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "Brand was updated successfully."
//         });
//       } else {
//         res.send({
//           message: `Cannot update brand with id = ${id}. Maybe brand was not found or req.body is empty!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating brand with id=" + id
//       });
//     });
// };

exports.delete = (req, res) => {
  const id = req.params.id;

  Brand.destroy({
    where: { id: id}
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Brand was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete data with id = ${id}. Maybe brand was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete brand with id=" + id
      });
    });
};

exports.deleteAll = (createValues, model) => {
const Model = db[model];
  return Model.deleteAll(createValues);
};
// exports.deleteAll = (req, res) => {
//   Brand.destroy({
//     where: {},
//     truncate: false
//   })
//     .then(nums => {
//       res.send({ message: `${nums} Mobiles were deleted successfully!` });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all mobiles."
//       });
//     });
// };
