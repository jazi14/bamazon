// require mysql, inquirer, and comlumnify packages 
var mysql = require('mysql')
var inquirer = require('inquirer')
var columnify = require('columnify')
// create a connection to the database using my password and dd name 
var connection = mysql.createConnection({
    host: 'localhost',
    port:3306,
    user: 'root',
    password:'1234',
    database: 'bamazon'
});

// Ask what manager function the user wants to do
    inquirer.prompt([
        {
            name: "choice",
            type: "list",
            choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product"],
            message: "What manager function do you need to do?"
        }
    ]).then(function(answer){
        if(answer.choice === "View Products"){
            console.log("View Products")
            viewProducts();
        }else if(answer.choice === "View Low Inventory"){
            console.log("View Low Inventory")
            lowInventory();
        }else if(answer.choice === "Add to Inventory"){
            console.log("Add to Inventory")
            addInventory();
            
        }else if(answer.choice === "Add New Product"){
            console.log("Add New Product")
            addProduct();
        }
    });

// Add a function to view the current inventory
function viewProducts(){
    connection.connect();
    connection.query("SELECT * FROM products", function(err, rows, fields){
        if (err) throw err;
        console.log(columnify(rows))
    });
    connection.end();
};

// Add function to view low Inventory
function lowInventory(){
    connection.connect();
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, rows, fields){
        if (err) throw err;
        console.log(columnify(rows))
    });
    connection.end();

}

// Add a function that will allow inventory updates
function addInventory(){
        inquirer.prompt([
            {
                name: "item_ID",
                type: "input",
                message: "What item number do you want to change the inventory for?",
                validate: function(value) {
                    if(isNaN(value) === false) {
                        return true;
                    }else{
                        return false;
                    }
                }
            },
            {
                name: "stock_quantity",
                type: "input",
                message: "What is the new number of items?",
                validate: function(value) {
                    if(isNaN(value) === false) {
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        ]).then(function(answer){
            // Send a query to get the product information from mysql based on what the user typed
            // Loop through the array it returns and update the database with the new stock level
            for (var i = 0; i < 2; i++) {
                connection.query("UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: answer.stock_quantity
                    },
                    {
                        item_ID: answer.item_ID                            }
                    ]);
            };
            connection.end();
        });
};

// Add a function that allows a manger to add an entirely new product
function addProduct(){
    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "What is the name of the product you want to add?"
        },
        {
            name: "department_name",
            type: "input",
            message: "What department does it belong in?"
        },
        {
            name: "price",
            type: "input",
            message: "How much is it?"
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "What is the initial stock quantity?"
        }
    ]).then(function(answer){
        connection.query("INSERT products SET ?", [
            {
            product_name: answer.product_name,
            department_name: answer.department_name,
            price: answer.price,
            stock_quantity: answer.stock_quantity
            }
        ]);
        connection.end();

    });
};