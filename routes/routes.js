
const express = require('express');
const db = require("../models/index.js");
const Op = db.Sequelize.Op;
//module.exports = app => {
  const model = require("../app/routers/routers.js");
  // const product = require("../app/routers/routers.js");
  let router = express.Router();
  //console.log(111);

  // Create a new brand
  router.post("/api/brands", (req, res) =>{
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

  router.post("/api/products", async (req, res) =>{
    const values = req.body;
    const productValues = {
      name: values.name,
      amount: values.amount,
      units: values.units,
      brandId: values.brandId,
      categoryId: values.categoryId
     };

     const brandValue = await model.findOne({where: { id: productValues.brandId}}, "Brand");

     const categValue = await model.findOne({where: { id: productValues.categoryId}}, "Category");

     if( brandValue && categValue){

    const head = await model.create(productValues, 'Product');

      values.spects.forEach((spect) => {
        spect.productId = head.id;
      })
      await db.Spect.bulkCreate(values.spects,{ individualHooks: true});
      res.status(201).send("Product added!!");
}

  else {
    res.status(500).send({
      message: "Enter correct brandId and categoryId!!"
    });
  }
  });

  router.put("/api/products/:id", async (req, res) => {
    const ID = req.params.id;
    const spect = [];
    const spectItems = await db.Spect.findAll({where: {}});

    db.Product.update(req.body, { where: { id: ID } } );

    if( req.body.spect ){


      req.body.spect.forEach((item) => {
        const spectValues = {
        id: item.id,
        method: item.method,
        name: item.name,
        value: item.value,
        productId: ID
      }
      // console.log(11);
      spect.push(spectValues);
      })

      // console.log(7);
      spect.forEach((items) => {
        // console.log(item);
        if(items.method === "create"){
          // console.log(1);
          const spects = {
            name: items.name,
            value: items.value,
            productId: ID
          }
          // console.log(2);
          model.create(spects, "Spect");
          // console.log(3);
        }
        // console.log(8);

        if( items.method === "update"){
          db.Spect.update({
            name: items.name,
            value: items.value,
            productId: ID
          }, {
            where: {
              id: items.id
             }
           });
        }

        // console.log(9);
        if( items.method === "delete"){
          db.Spect.destroy({
            where: {
              id: items.id
            }
          })
      }
    })
}
    res.status(200).send("Product Updated!!!");
  });

  router.post("/api/categories", (req, res) =>{

    const productValues = {
      name: req.body.name,
     };

    model.create(productValues, 'Category')
      .then(data => {
        res.status(201).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the categories."
        });
      });
  });

  router.post("/api/spects", (req, res) =>{

    const spectValues = {
      name: req.body.name,
      value: req.body.value,
      productId: req.body.productId
     };

    model.create(spectValues, 'Spect')
      .then(data => {
        res.status(201).send(data);
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

  router.post("/api/cart", async (req, res) =>{

    const cartValues = {
      qty: req.body.qty,
      status: req.body.status,
      amount: req.body.amount,
      totalAmount: (req.body.qty) * (req.body.amount),
      productId: req.body.productId
     };

     const productValue = await model.findOne({ where: {id: cartValues.productId }}, "Product");
     if( productValue ){

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
  res.status(201).send("Added in cart!!");

    }
     else{
    model.create(cartValues, 'Cart')
      .then(data => {
        res.status(201).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the cart."
        });
      });
    }
  }
  else{
    res.status(500).send({
      message: "Enter correct ProductId!!"
    });
  }
  });

  router.get("/api/brands/findall", (req, res) => {
    const filter = {
      where: {},
    };
    model.findAll(filter, 'Brand')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving brands."
      });
    });
  });

  router.get("/api/categories/findall", (req, res) => {
    const filter = {
      where: {},
    };
    model.findAll(filter, 'Category')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving categories."
      });
    });
  });

  // Retrieve all brand
  router.get("/api/products", (req, res) => {
    const options = req.query;

    let spectFilter = {};
    let filterarray;
    if(Array.isArray(options.spectId)) {
      filterarray  = options.spectId.filter(x => x !== '');
    } else if(options.spectId == '') {
      filterarray = null;
    }
    // console.log("options.spectId",options.spectId)
    if(options.spectId && filterarray && filterarray.length){
      spectFilter.id = options.spectId;
    }

    let categorySearchFilter = {};
    if (options.categorySearchQuery) {
      categorySearchFilter = {
        name: {
        [Op.iLike]: `%${options.categorySearchQuery}%`
        }
      }
    }

    let brandSearchQuery = {};
    if (options.brandSearchQuery){
      brandSearchQuery = {
        name: {
          [Op.iLike]: `%${options.brandSearchQuery}%`
        }
      }
    }
    // console.log(spectFilter);

    const filter = {
      where: {},
      include: [
        {
          model: db.Brand,
          where: brandSearchQuery,
          required: false
        }, {
          model: db.Spect,
          where: spectFilter,
          required: false
        }, {
          model: db.Category,
          where: categorySearchFilter,
          required: false
        }
      ]
    };
    if(options.brandId){
      filter.where.brandId = options.brandId;
    }
    if(options.categoryId){
      filter.where.categoryId = options.categoryId;
    }

    if(options.productSearchQuery){
      filter.where.name = {
        [Op.iLike]: `%${options.productSearchQuery}%`
      }
    }
    // console.log(filter);

    model.findAll(filter, 'Product')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving products."
      });
    });
  });

  router.get("/api/spects/findall", (req, res) => {
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
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving spects."
      });
    });
  });



  router.get("/api/cart/findall", (req, res) => {
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
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cart."
      });
    });
  });

  router.get("/api/order/findall", (req, res) => {
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
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving order."
      });
    });
  });

  router.get('/api/order', async (req,res) => {
    const filter = {
      where: {},
      include: [{
        model: db.OrderItem,
        required: false,
        as: 'Order Items'
      }]
    }
    const ret = await db.Order.findAll(filter);
    res.status(200).send(ret)
  })

  router.get('/api/order/:orderId', async (req,res) => {
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
    res.status(200).send(ret);
  })

  router.post("/api/orders", async (req, res) =>{

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
      res.status(500).send("Add the Cart Items!!");
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
    res.status(201).send("Orders Placed!!");
}
  });


  router.get("/api/brands/:id", (req, res) => {
    const id = req.params.id;

    model.findByPk(id, 'Brand')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving brand with id=" + id
      });
    });
  });

  router.get("/api/brand/:name", (req, res) => {
    const name = req.params.name;
    const filter = {
      where: { name: name}
    };

    model.findAll(filter, 'Brand')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving brand with name = " + name
      });
    });
  });

  router.get("/api/products/:id", (req, res) => {
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
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving product with id=" + id
      });
    });
  });

  router.get("/api/product/:name", (req, res) => {
    const name = req.params.name;
    const filter = {
      where: { name: name},
      include:[{
        model: db.Spect,
      }]
    };

    model.findAll(filter, 'Product')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving product with name = " + name
      });
    });
  });

  router.get("/api/categories/:id", (req, res) => {
    const id = req.params.id;

    model.findByPk(id, 'Category')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving category with id=" + id
      });
    });
  });

  router.get("/api/category/:name", (req, res) => {
    const name = req.params.name;
    const filter = {
      where: { name: name}
    };

    model.findAll(filter, 'Category')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving category with name = " + name
      });
    });
  });

  router.get("/api/spects/:id", (req, res) => {
    const id = req.params.id;

    model.findByPk(id, 'Spect')
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving spects with id=" + id
      });
    });
  });

  router.get("/api/spect/:value", (req, res) => {
    const value = req.params.value;
    const filter = {
      where: { value: value },
      include: [{
        model: db.Product
      }]
    };

    model.findAll(filter, 'Spect')
    .then(data => {
      res.status(200).send(data);
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


  router.delete("/api/brands/deleteAll", (req, res) => {
      model.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.status(204).send({ message: `${nums} Mobiles were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all brands."
          });
        });
  });
  router.delete("/api/products/deleteAll", (req, res) => {
      model.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.status(204).send({ message: `${nums} Mobiles were deleted successfully!` });
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
