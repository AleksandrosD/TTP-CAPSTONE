const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");
const { ForbiddenError, NotFoundError } = require("../errors");
const { Restaurant, rTable, Food, FoodCategory, Party_Order, Order_Food, DailyReport } = require("../models");
const { Op } = require('sequelize');
const { exportDailyReportsToExcel } = require("./excelExport")

const getRTable = async (id) => {
    const table = await rTable.findByPk(parseInt(id, 10));
    if (!table) {
        throw new NotFoundError("Table not found");
    }
    return table;
};

const getFoodCategory = async (id) => {
    const category = await FoodCategory.findByPk(parseInt(id, 10));
    if (!category) {
        throw new NotFoundError("Category not found");
    }
    return category;
};

const getFood = async (id) => {
    const category = await Food.findByPk(parseInt(id, 10));
    if (!category) {
        throw new NotFoundError("Category not found");
    }
    return category;
};


//Gets
const authorizeRTableGet = (session, table) => {
    if (parseInt(session.userId, 10) !== table.RestaurantId) {
        throw new ForbiddenError("You are not authorized to get this table");
    }
}

const authorizeFoodCategoryGet = (session, foodCategory) => {
    if (parseInt(session.userId, 10) !== foodCategory.RestaurantId) {
        throw new ForbiddenError("You are not authorized to get this category");
    }
}

const authorizeFoodGet = (session, food) => {
    if (parseInt(session.userId, 10) !== food.RestaurantId) {
        throw new ForbiddenError("You are not authorized to get this food");
    }
}


//Deletes
const authorizeRTableDelete = (session, table) => {
    if (parseInt(session.userId, 10) !== table.RestaurantId) {
        throw new ForbiddenError("You are not authorized to delete this table");
    }
}

const authorizeFoodCategoryDelete = (session, foodCategory) => {
    if (parseInt(session.userId, 10) !== foodCategory.RestaurantId) {
        throw new ForbiddenError("You are not authorized to delete this category");
    }
}

const authorizeFoodDelete = (session, food) => {
    if (parseInt(session.userId, 10) !== food.RestaurantId) {
        throw new ForbiddenError("You are not authorized to delete this food");
    }
}

const handleErrors = (err, res) => {
    console.error(err);
    if (err.name === "SequelizeValidationError") {
        return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    res.status(500).send({ message: err.message });
}


// ---------- rTable ---------- //

// Get all the tables
router.get("/rTables", authenticateUser, async (req, res) => {
    try {
        const allTables = await rTable.findAll();

        // Assuming you have the logged-in user's session data available in req.session
        const session = req.session;

        // Filter the tables based on authorization
        const authorizedTables = allTables.filter(table => {
            try {
                authorizeRTableGet(session, table);
                return true; // Include this table in the response
            } catch (error) {
                return false; // Exclude this table from the response
            }
        });

        res.status(200).json(authorizedTables);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
});


// Get a specific table
router.get("/rTables/:id", authenticateUser, async (req, res) => {
    try {
        const table = await getRTable(req.params.id);

        if (!table) {
            return res.status(404).send({ message: "Table not found" });
        }

        const session = req.session;

        try {
            authorizeRTableGet(session, table);
            res.status(200).json(table);
        } catch (error) {
            res.status(403).send({ message: "You are not authorized to access this table" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
});


// Create a new table
router.post("/rTables", authenticateUser, async (req, res) => {
    const rUser = await Restaurant.findByPk(req.session.userId);

    try {
        // Check authorization to create a table for the restaurant
        authorizeRTableGet(req.session, { RestaurantId: rUser.id });

        // Find the highest existing table number for the restaurant
        const maxTableNumRecord = await rTable.findOne({
            where: {
                RestaurantId: rUser.id,
            },
            order: [['tableNum', 'DESC']],
        });

        let nextTableNum = 1;

        if (maxTableNumRecord) {

            // Loop through existing table numbers to find the next available one
            for (let i = 1; i <= maxTableNumRecord.tableNum + 1; i++) {
                const table = await rTable.findOne({
                    where: {
                        RestaurantId: rUser.id,
                        tableNum: i,
                    },
                });

                if (!table) {
                    nextTableNum = i;
                    break;
                }
            }
        }

        const newTableData = {
            tableNum: nextTableNum,
            RestaurantId: rUser.id,
        };

        const newTable = await rTable.create(newTableData);
        res.status(201).json(newTable);

    } catch (err) {
        handleErrors(err, res);
    }
});



// Delete a specific table
router.delete("/rTables/:id", authenticateUser, async (req, res) => {
    try {
        const table = await getRTable(req.params.id);
        await authorizeRTableDelete(req.session, table);
        await table.destroy();
        res.status(200).send({ message: "Table deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
});


// ---------- FoodCategory ---------- //

// Get all the categories
router.get("/foodCategories", authenticateUser, async (req, res) => {
    try {
        const allCategories = await FoodCategory.findAll();

        const session = req.session;

        // Filter the categories based on authorization
        const authorizedCategories = allCategories.filter(category => {
            try {
                authorizeFoodCategoryGet(session, category);
                return true;
            } catch (error) {
                return false;
            }
        });

        res.status(200).json(authorizedCategories);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
});


// Get a specific category
router.get("/foodCategories/:id", authenticateUser, async (req, res) => {
    try {
        const category = await getFoodCategory(req.params.id);

        if (!category) {
            return res.status(404).send({ message: "Category not found" });
        }

        // Assuming you have the logged-in user's session data available in req.session
        const session = req.session;

        try {
            authorizeFoodCategoryGet(session, category);
            res.status(200).json(category);
        } catch (error) {
            res.status(403).send({ message: "You are not authorized to access this category" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
});


router.post("/foodCategories", authenticateUser, async (req, res) => {
    const { type } = req.body;
    const rUser = await Restaurant.findByPk(req.session.userId);

    try {
        // Check authorization to create a category for the restaurant
        authorizeFoodCategoryGet(req.session, { RestaurantId: rUser.id });

        const existingRecord = await FoodCategory.findOne({
            where: {
                type: type,
                RestaurantId: rUser.id, // Ensure the category belongs to the same restaurant
            },
        });
        if (existingRecord)
            return res.status(409).json({ error: "Category already exists for this restaurant" });

        const newCategory = await FoodCategory.create({ ...req.body, RestaurantId: rUser.id });
        res.status(201).json(newCategory);

    } catch (err) {
        handleErrors(err, res);
    }
});


// Delete a specific category
router.delete("/foodCategories/:id", authenticateUser, async (req, res) => {
    try {
        const category = await getFoodCategory(req.params.id);
        await authorizeFoodCategoryDelete(req.session, category);
        await category.destroy();
        res.status(200).send({ message: "Category deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
});


// ---------- Food ---------- //

// Get all the food
router.get("/foodCategories/:id/foods", authenticateUser, async (req, res) => {
    const categoryId = req.params.id;

    try {
        const allFoods = await Food.findAll({ where: { FoodCategoryId: categoryId } });

        res.status(200).json(allFoods);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
});


// Get a specific food
router.get("/foodCategories/:catId/foods/:id", authenticateUser, async (req, res) => {
    const foodId = req.params.id;

    try {
        const food = await Food.findByPk(foodId);

        if (food) {
            res.status(200).json(food);
        } else {
            res.status(404).send({ message: "Food not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
});


// Create a new food
router.post("/foodCategories/:id/foods", authenticateUser, async (req, res) => {
    const { name } = req.body;

    try {
        const existingRecord = await Food.findOne({
            where: {
                name: name,
                FoodCategoryId: req.params.id
            },
        });
        
        if (existingRecord)
            return res.status(409).json({ error: "Food already exists" });


        const newFood = await Food.create(req.body);
        res.status(201).json(newFood);

    } catch (err) {
        handleErrors(err, res);
    }
});


// Delete a specific category
router.delete("/foodCategories/:catId/foods/:id", authenticateUser, async (req, res) => {
    try {
        const food = await getFood(req.params.id);
        //await authorizeFoodDelete(req.session, food);
        await food.destroy();
        res.status(200).send({ message: "Food deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
});


// ---------- Party Order ---------- //

// Get a party order
router.get('/partyOrders/:rTableId', async (req, res) => {
    const { rTableId } = req.params;

    try {
        const partyOrder = await Party_Order.findOne({
            where: {
                rTableId,
                open: true
            },

            include: [
                {
                    model: Food,
                    attributes: ['id', 'price', 'name'],
                    through: {
                        attributes: ['Quantity']
                    }
                }
            ]
        });

        if (partyOrder) {
            res.status(200).json(partyOrder);
        } else {
            res.status(404).json({ message: 'No party order found for the specified table' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error occurred while retrieving party order', error: err });
    }
});


// Create a new party order
router.post('/rTables/:id/partyOrders', async (req, res) => {
    const rTableId = req.params.id;
    const rUser = req.session.userId;

    try {

        const existingOpenOrder = await Party_Order.findOne({
            where: {
                rTableId: rTableId,
                open: true

            }
        });

        if (existingOpenOrder) {
            return res.status(400).json({ message: 'An open party order already exists for this table' });
        }

        // Create a new party order
        const newPartyOrder = await Party_Order.create({
            date: new Date(),
            Total: 0,
            rTableId: rTableId,
            RestaurantId: rUser,
            open: true,
        });

        res.status(201).json(newPartyOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error occurred while creating party order', error: err });
    }
});

// Close a party order
router.patch('/rTables/:id/partyOrders/:partyOrderId/close', async (req, res) => {
    const PartyOrderId = req.params.partyOrderId;
    const rTableId = req.params.id;

    try {
        const partyOrder = await Party_Order.findOne({
            where: {
                id: PartyOrderId,
                rTableId: rTableId,
                open: true
            }
        });

        if (!partyOrder) {
            return res.status(404).json({ message: 'Open party order not found for this table' });
        }

        // Update the 'open' status to false
        await partyOrder.update({ open: false });

        // Find the corresponding daily report based on the party order's date
        const partyOrderDate = new Date(partyOrder.createdAt);
        const startOfDay = new Date(partyOrderDate.getFullYear(), partyOrderDate.getMonth(), partyOrderDate.getDate());
        const endOfDay = new Date(partyOrderDate.getFullYear(), partyOrderDate.getMonth(), partyOrderDate.getDate() + 1);
        
        const dailyReport = await DailyReport.findOne({
            where: {
                RestaurantId: partyOrder.RestaurantId,
                date: {
                    [Op.gte]: startOfDay,
                    [Op.lt]: endOfDay,
                },
            },
        });

        if (dailyReport) {
            // Update the 'partyOrderTotal' in the daily report by adding the 'total' from the party order
            dailyReport.partyOrderTotal += partyOrder.Total;
            dailyReport.netProfit = dailyReport.partyOrderTotal - (dailyReport.eCost + dailyReport.sCost);
            await dailyReport.save();

            // Export daily reports to Excel
            const dailyReports = await DailyReport.findAll({
                where: {
                    RestaurantId: dailyReport.RestaurantId,
                },
            });

            await exportDailyReportsToExcel(dailyReports, dailyReport.RestaurantId);
        }

        res.status(200).json({ message: 'Party order closed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error occurred while closing party order', error: err });
    }
});



// ---------- Order Food ---------- //

// Create an order
router.post('/orderFoods', async (req, res) => {
    const orderFoods = req.body.orderFoods;

    try {
        let totalFoodPrice = 0;

        for (const { FoodId, PartyOrderId, Quantity } of orderFoods) {
            const food = await Food.findByPk(FoodId);
            if (!food) {
                return res.status(404).json({ message: 'Food not found' });
            }

            // Find the associated Party_Order
            const partyOrder = await Party_Order.findByPk(PartyOrderId);
            if (!partyOrder) {
                return res.status(404).json({ message: 'Party order not found' });
            }

            // Check if the Party_Order is open
            if (!partyOrder.open) {
                return res.status(400).json({ message: 'Cannot create Order_Food for a closed party order' });
            }

            // Check if the Order_Food already exists
            let orderFood = await Order_Food.findOne({
                where: {
                    FoodId: FoodId,
                    PartyOrderId: PartyOrderId
                }
            });

            if (orderFood) {
                // Update the existing Order_Food's Quantity
                const newQuantity = orderFood.Quantity + Quantity;
                await orderFood.update({ Quantity: newQuantity });
            } else {
                // Create a new Order_Food
                orderFood = await Order_Food.create({
                    FoodId: FoodId,
                    PartyOrderId: PartyOrderId,
                    Quantity: Quantity
                });
            }

            // Calculate the price of the added food item
            const foodPrice = food.price * Quantity;
            totalFoodPrice += foodPrice;

            // Update the total price in the Party_Order table
            const newTotal = partyOrder.Total + foodPrice;
            await partyOrder.update({ Total: newTotal });
        }

        res.status(201).json({ message: 'Order foods created successfully', totalFoodPrice });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error occurred while creating order foods', error: err });
    }
});

//deleting an order
router.delete('/orderFoods/:foodId/:partyOrderId', async (req, res) => {
    const foodId = req.params.foodId;
    const partyOrderId = req.params.partyOrderId;

    try {
        const orderFood = await Order_Food.findOne({
            where: {
                FoodId: foodId,
                PartyOrderId: partyOrderId,
            },
        });

        if (!orderFood) {
            return res.status(404).json({ message: 'Order food not found' });
        }

        const food = await Food.findByPk(foodId);
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }

        const partyOrder = await Party_Order.findByPk(partyOrderId);
        if (!partyOrder) {
            return res.status(404).json({ message: 'Party order not found' });
        }

        // Check if the Party_Order is open
        if (!partyOrder.open) {
            return res.status(400).json({ message: 'Cannot delete Order_Food for a closed party order' });
        }

        const foodPrice = food.price * orderFood.Quantity;

        // Update the total price in the Party_Order table
        const newTotal = partyOrder.Total - foodPrice;
        await partyOrder.update({ Total: newTotal });

        await orderFood.destroy();

        res.status(200).json({ message: 'Order food deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error occurred while deleting order food', error: err });
    }
});

  

// ---------- Daily Report ---------- //

// Get all dailyReports data for a specific RestaurantId
router.get('/dailyReports/:restaurantId', async (req, res) => {
    const { restaurantId } = req.params;
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
  
      const dailyReports = await DailyReport.findAll({
        where: {
          RestaurantId: restaurantId,
          createdAt: {
            [Op.gte]: today,
          },
        },
      });
  
      res.status(200).json(dailyReports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching dailyReports data', error: error });
    }
  });

//Post a dailyReport every day
const createDailyReport = async (restaurantId, date) => {
    try {
        const newReport = await DailyReport.create({
            RestaurantId: restaurantId,
            date: date,
            eCost: 0,
            sCost: 0,
            partyOrderTotal: 0,
            netProfit: 0,
        });

        // Collect daily reports for export
        const dailyReports = await DailyReport.findAll({
            where: {
                RestaurantId: restaurantId,
            },
        });

        // Export daily reports to Excel
        await exportDailyReportsToExcel(dailyReports, restaurantId);

        console.log(`Daily report created for RestaurantId ${restaurantId} on ${date}:`, newReport);
    } catch (error) {
        console.error('Error creating daily report:', error.message);
    }
};

const scheduleDailyReportsForRestaurants = async () => {
    try {
        const restaurants = await Restaurant.findAll(); // Fetch all restaurants from your database

        for (const restaurant of restaurants) {
            const now = new Date();
            const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            
            const existingReport = await DailyReport.findOne({
                where: {
                    RestaurantId: restaurant.id,
                    date: scheduledTime,
                },
            });

            if (!existingReport) {
                await createDailyReport(restaurant.id, scheduledTime);
            }
        }
    } catch (error) {
        console.error('Error fetching restaurants:', error.message);
    }
};

router.post("/dailyReports", authenticateUser, async (req, res) => {
    try {
        const now = new Date();
        const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        
        const existingReport = await DailyReport.findOne({
            where: {
                RestaurantId: req.user.RestaurantId,
                date: scheduledTime,
            },
        });

        if (!existingReport) {
            await createDailyReport(req.user.RestaurantId, scheduledTime);
        }
        
        return res.status(201).json({ message: 'Daily report creation initiated' });
    } catch (error) {
        console.error('Error creating daily report:', error.message);
        return res.status(500).json({ message: 'Error creating daily report' });
    }
});

// Start scheduling the daily reports for each restaurant
scheduleDailyReportsForRestaurants();


router.patch('/dailyReports/:restaurantId', authenticateUser, async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const { eCost, sCost } = req.body;

    try {
        // Find the daily report by ID
        const dailyReport = await DailyReport.findOne({
            where: {
                RestaurantId: restaurantId,
                date: {
                    [Op.gte]: new Date().setHours(0, 0, 0, 0),
                    [Op.lt]: new Date().setHours(24, 0, 0, 0),
                },
            },
        });

        if (!dailyReport) {
            return res.status(404).json({ message: 'Daily report not found' });
        }

        // Update the eCost and sCost fields
        if (eCost !== undefined) {
            dailyReport.eCost = eCost;
        }

        if (sCost !== undefined) {
            dailyReport.sCost = sCost;
        }

        // Calculate the netProfit based on the updated eCost and sCost
        dailyReport.netProfit = dailyReport.partyOrderTotal - (dailyReport.eCost + dailyReport.sCost);

        // Save the changes
        await dailyReport.save();

        const dailyReports = await DailyReport.findAll({
            where: {
                RestaurantId: restaurantId,
            },
        });

        await exportDailyReportsToExcel(dailyReports, restaurantId);

        res.status(200).json({ message: 'Daily report updated successfully', dailyReport });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error occurred while updating daily report', error: err });
    }
});


module.exports = router;