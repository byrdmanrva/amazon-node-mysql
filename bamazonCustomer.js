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

// inquirer.prompt([
//     {
//         name: "userType",
//         type: "list",
//         message: "Are you a customer or a manager?",
//         choices: [
//             "CUSTOMER",
//             "MANAGER"
//         ]
//     }
// ]).then(function (res) {
//     if (res.userType === "CUSTOMER") {
//         user();
//     }
// })

// Connecting to the bamazon database
function user() {
    connection.connect(function (err) {
    if (err) {
        throw err
    };
    // Selecting from the products table
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
        // Prompts the user for a product id
        inquirer.prompt([
            {
                name: "product_id",
                type: "prompt",
                message: "Enter product id to purchase item"
            }
        ]).then(function (res) {
            // Obtaining the information for the product selected
            connection.query("SELECT * FROM products", function (err, results) {
                if (err) {
                    throw err
                };
                for (i = 0; i < results.length; i++) {
                    if (results[i].item_id == res.product_id) {
                        var selectedItem = (results[i].product_name)
                        var currentQuantity = (results[i].stock_quantity)
                        var selectedProductId = (res.product_id)
                        var itemPrice = (results[i].price)
                        // Asks the user how many of the product they would like to purchase
                        inquirer.prompt([
                            {
                                name: "quantity",
                                type: "prompt",
                                message: "How many would you like to purchase?"
                            }
                        ]).then(function (res) {
                            var requestedQuantity = (res.quantity)
                            if (currentQuantity < requestedQuantity) {
                                console.log("INSUFFICIENT QUANTITY!")
                                connection.end();
                            }
                            else {
                            var newQuantity = (currentQuantity - res.quantity)
                            var customerTotal = (itemPrice * requestedQuantity)
                            var totalDecimal = customerTotal.toFixed(2);
                            // Updates the bamazon database with the new stock quantity
                            connection.query("UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: newQuantity
                                    },
                                    {
                                        item_id: selectedProductId
                                    }
                                ],
                                function (error) {
                                    if (error) {
                                        throw err
                                    };
                                    console.log("---------------------------------------------------------")
                                    console.log(selectedItem + " ordered!")
                                    console.log("Your total is: $" + totalDecimal)
                                    console.log("Remaining quantity: " + newQuantity)
                                    console.log("---------------------------------------------------------")
                                    connection.end();

                                }
                            )
                        }})
                    }
                }
            })
        })
    })
})};

user();