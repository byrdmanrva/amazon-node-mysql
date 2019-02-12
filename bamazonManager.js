require('dotenv').config()

// Required npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");

// Connection details
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.root_password,
    database: "bamazon"
});

function manager() {
    connection.connect(function (err) {
        if (err) {
            throw err
        };
        // Prompts the manager what they would like to do
        inquirer.prompt([
            {
                name: "manager_choice",
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "View products for sale",
                    "View low invetory",
                    "Update inventory",
                    "Create new product"
                ]
            }
        ]).then(function (res) {
            // If "View products for sale is selected, dispalys all prodcuts for sale"
            if (res.manager_choice === "View products for sale") {
                inventory()
            };
            if (res.manager_choice === "View low invetory") {
                low();
            };
            if (res.manager_choice === "Update inventory") {
                update();
            };
            if (res.manager_choice === "Create new product") {
                create();
            };
        })
    }
    )
};

function inventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) {
            throw err
        };
        // Displays products available
        console.log("\n---------------------------------------------------------")
        console.log("PRODUCTS AVAILABLE")
        console.log("---------------------------------------------------------")
        for (i = 0; i < results.length; i++) {
            console.log("Product id: " + results[i].item_id)
            console.log("Product: " + results[i].product_name)
            console.log("Department: " + results[i].department_name)
            console.log("Price: $" + results[i].price)
            console.log("Quantity available: " + results[i].stock_quantity)
            console.log("---------------------------------------------------------")
        }
        connection.end();
    }
    )
}

function low() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) {
            throw err
        };
        for (i = 0; i < results.length; i++) {
            // If a products stock quantity drops below 5, they will be displayed
            if (results[i].stock_quantity < 5) {
                console.log("---------------------------------------------------------")
                console.log(results[i].stock_quantity + " " + results[i].product_name + "(s) remaining")
                console.log("---------------------------------------------------------")
            }
        }
        connection.end();
    })
}

function update() {
    inquirer.prompt([
        {
            name: "update_id",
            message: "Which product id would you like to update?",
            type: "prompt"
        }
    ]).then(function (res) {
        var selectedId = (res.update_id)
        connection.query("SELECT * FROM products", function (err, results) {
            if (err) {
                throw err
            };
            for (i = 0; i < results.length; i++) {
                if (results[i].item_id == res.update_id) {
                    var selectedProduct = (results[i].product_name)
                    var currentInventory = (results[i].stock_quantity)
                    inquirer.prompt([
                        {
                            name: "quantity_update",
                            message: "How many would you like to add to the inventory?",
                            type: "prompt"
                        }
                    ]).then(function (res) {
                        var newInventory = (parseInt(res.quantity_update) + parseInt(currentInventory))
                        connection.query("UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: newInventory
                                },
                                {
                                    item_id: selectedId
                                }
                            ],
                            function (error) {
                                if (error) {
                                    throw err
                                };
                                console.log("---------------------------------------------------------")
                                console.log(selectedProduct + " updated!")
                                console.log("New inventory: " + newInventory)
                                console.log("---------------------------------------------------------")
                                connection.end();
                            }
                        )
                    })
                }
            }
        })
    })
}

function create () {
    inquirer.prompt([
        {
            name: "product_name",
            message: "What is the name of the product you are adding?",
            type: "prompt"
        },
        {
            name: "product_department",
            message: "Which Department does the product belong to?",
            type: "prompt"
        },
        {
            name: "price",
            message: "How much does it cost?",
            type: "prompt"
        },
        {
            name: "quantity",
            message: "How many are you adding to the inventory?",
            type: "prompt"
        }
    ]).then(function(res) {
        var productName = (res.product_name)
        var productDepartment = (res.product_department)
        var productPrice = (res.price)
        var productQuantity = (res.quantity)
        connection.query("INSERT INTO products SET ?",
        {
            product_name: productName,
            department_name: productDepartment,
            price: productPrice,
            stock_quantity: productQuantity
        },
        function(err) {
            if (err) {
                throw err
            };
            console.log("---------------------------------------------------------")
            console.log(productName + " added!")
            console.log("---------------------------------------------------------")
            connection.end();
        })
    })
}

manager();

