
const express = require('express');
const db = require("../models/index.js");
const Op = db.Sequelize.Op;
//module.exports = app => {
  const model = require("../app/routers/routers.js");
  // const product = require("../app/routers/routers.js");
  let router = express.Router();
  //console.log(111);

  // Create a new brand
  router.post("/brands", (req, res) =>{
      const brandValues = {
         name: req.body.name,
       };

    model.create(brandValues, 'Brand')
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the brand."
        });
      });
  });

  router.post("/products", async (req, res) =>{
    const values = req.body;
    const productValues = {
      name: values.name,
      amount: values.amount,
      units: values.units,
      brandId: values.brandId,
      categoryId: values.categoryId
     };

    const head = await model.create(productValues, 'Product');
      // .then(data => {
      //   res.send(data);
      // })
      // .catch(err => {
      //   res.status(500).send({
      //     message:
      //       err.message || "Some error occurred while creating the products."
      //   });
      // });
      // const spectValues = await db.Spect.findAll({
      //   where: {}
      // });
      // const spects = [];
      values.spects.forEach((spect) => {
        spect.productId = head.id;
      })
      await db.Spect.bulkCreate(values.spects,{ individualHooks: true});
      res.send("Product added!!");

  });

  router.post("/categories", (req, res) =>{

    const productValues = {
      name: req.body.name,
     };

    model.create(productValues, 'Category')
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the categories."
        });
      });
  });

  router.post("/spects", (req, res) =>{

    const spectValues = {
      name: req.body.name,
      value: req.body.value,
      productId: req.body.productId
     };

    model.create(spectValues, 'Spect')
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the spects."
        });
      });
  });

  // router.post("/orders", (req, res) =>{
  //
  //   const orderValues = {
  //     qty: req.body.qty,
  //     amount: req.body.amount,
  //     totalAmount: (req.body.qty) * (req.body.amount),
  //     productId: req.body.productId
  //    };
  //
  //   model.create(orderValues, 'Order')
  //     .then(data => {
  //       res.send(data);
  //     })
  //     .catch(err => {
  //       res.status(500).send({
  //         message:
  //           err.message || "Some error occurred while creating the orders."
  //       });
  //     });
  // });

  router.post("/cart", async (req, res) =>{

    const cartValues = {
      qty: req.body.qty,
      status: req.body.status,
      amount: req.body.amount,
      totalAmount: (req.body.qty) * (req.body.amount),
      productId: req.body.productId
     };

     const cartItems = await db.Cart.findAll({
       where: {
         status: {
           [Op.eq]: 'active',
         }
       }
     });

     let cartTotal = 0;
     let cartQuantity = 0;
     let Id = 0;

     cartItems.forEach((item) => {
       if(item.productId === cartValues.productId){
         cartQuantity = cartValues.qty + item.qty;
         cartTotal = cartValues.totalAmount + item.totalAmount;
         Id = item.id;

       }
     });

    if( cartQuantity ){

    db.Cart.update({
      qty: cartQuantity,
      totalAmount: cartTotal
    },{
      where: {
        id: Id,
      }
    }
  );
  res.send("Added in cart!!");

    }
     else{
    model.create(cartValues, 'Cart')
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the cart."
        });
      });
    }
  });

  router.get("/brands/findall", (req, res) => {
    const filter = {
      where: {},
    };
    model.findAll(filter, 'Brand')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving brands."
      });
    });
  });

  // Retrieve all brand
  router.get("/products/findall", (req, res) => {
    const filter = {
      where: {},
      include: [
        {
          model: db.Brand
        }, {
          model: db.Spect
        }
      ]
    };
    model.findAll(filter, 'Product')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products."
      });
    });
  });

  router.get("/spects/findall", (req, res) => {
    const filter = {
      where: {},
      include: [
        {
          model: db.Product,
        }
      ]
    };
    model.findAll(filter, 'Spect')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving spects."
      });
    });
  });



  router.get("/cart/findall", (req, res) => {
    const filter = {
      where: { status: "active"},
      include: [
        {
          model: db.Product,
          include: [
            {
            model: db.Brand
          }
          ]
        }
      ]
    };
    model.findAll(filter, 'Cart')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cart."
      });
    });
  });

  router.get("/order/findall", (req, res) => {
    const filter = {
      where: {},
      include: [
        {
          model: db.OrderItem,
          as: 'Order Items'
        }
      ]
    };
    model.findAll(filter, 'Order')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving order."
      });
    });
  });

  router.get('/order', async (req,res) => {
    const filter = {
      where: {},
      include: [{
        model: db.OrderItem,
        required: false,
        as: 'Order Items'
      }]
    }
    const ret = await db.Order.findAll(filter);
    res.send(ret)
  })

  router.get('/order/:orderId', async (req,res) => {
    const { orderId } = req.params;
    const filter = {
      where: {
        id: orderId
      },
      include: [{
        model: db.OrderItem,
        required: false,
        as: 'Order Items'
      }]
    }
    const ret = await db.Order.findOne(filter);
    res.send(ret)
  })

  router.post("/order", async (req, res) =>{

    const cartItems = await db.Cart.findAll({
      where: {
        status: {
          [Op.eq]: 'active',
        }
      }
    });
    let orderTotal = 0;
    let orderQuantity = 0;
    let productIds = [];
    const cartIds = [];

    cartItems.forEach((item) => {
      orderTotal = orderTotal + item.totalAmount;
      orderQuantity = orderQuantity + item.qty,
      productIds.push(item.productId);
      cartIds.push(item.id);
    });

    // Validation for Cart
    if(orderQuantity === 0){
      res.send("Add the Cart Items!!");
    }

    else{
    const orderValues = {
      qty: orderQuantity,
      totalAmount: orderTotal
     };


    // else{
    console.log(orderTotal, orderQuantity);
    const order = await model.create(orderValues, 'Order')

    const orderRetObject = order.toJSON();
    await db.Cart.update({
      status: 'inactive'
    }, {
      where: {
        id: cartIds,
      }
    })
    const orderItemValues = [];
    cartItems.forEach((item) => {
      const orderItem = {
        orderId: orderRetObject.id,
        productId: item.productId,
        amount: item.amount,
        totalAmount: item.totalAmount,
        qty: item.qty
      }
      orderItemValues.push(orderItem);
    })
    console.log('orderItemValues', orderItemValues);
    await db.OrderItem.bulkCreate(orderItemValues, { individualHooks: true });
    res.send("Orders Placed!!");
}
  });


  router.get("/brands/:id", (req, res) => {
    const id = req.params.id;

    model.findByPk(id, 'Brand')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving brand with id=" + id
      });
    });
  });

  router.get("/brand/:name", (req, res) => {
    const name = req.params.name;
    const filter = {
      where: { name: name}
    };

    model.findAll(filter, 'Brand')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving brand with name = " + name
      });
    });
  });

  router.get("/products/:id", (req, res) => {
    const id = req.params.id;
    const filter = {
      where: {
        id: id
      },
      include: [{
        model: db.Spect,
      }]
    }

    model.findOne(filter, 'Product')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving product with id=" + id
      });
    });
  });

  router.get("/categories/:id", (req, res) => {
    const id = req.params.id;

    model.findByPk(id, 'Category')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving category with id=" + id
      });
    });
  });

  router.get("/spects/:id", (req, res) => {
    const id = req.params.id;

    model.findByPk(id, 'Spect')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving spects with id=" + id
      });
    });
  });

  router.get("/spect/:value", (req, res) => {
    const value = req.params.value;
    const filter = {
      where: { value: value },
      include: [{
        model: db.Product
      }]
    };

    model.findAll(filter, 'Spect')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving spects with id=" + id
      });
    });
  });


  // router.get("/order/:id", (req, res) => {
  //   const id = req.params.id;
  //
  //   model.findByPk(id, 'Order')
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message: "Error retrieving order with id=" + id
  //     });
  //   });
  // });

  // router.put("/:id", model.update);


  // router.delete("/:id", model.delete);


  router.delete("/brands/deleteAll", (req, res) => {
      model.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Mobiles were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all brands."
          });
        });
  });
  router.delete("products/deleteAll", (req, res) => {
      model.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Mobiles were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all products."
          });
        });
  });

  //router.use('/api/mobiles', router);
//};
module.exports = router;
