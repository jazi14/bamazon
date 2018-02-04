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
// Start some variables to hold price and quantity
var userPrice
var userQuanity
// Start a connection and display the items in the table
connection.connect();
connection.query("SELECT * FROM products", function(err, rows, fields){
    if (err) throw err;
    console.log(columnify(rows))
    purchaseItem();

});
// connection.end();


// Create a function to ask what item the user wants to buy
function purchaseItem(){
    inquirer.prompt([
        {
            name: "item_ID",
            type: "input",
            message: "What item number do you want to purchase?  It's the first number on the left.",
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
            message: "How many items would you like?  Make sure there are enough.",
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
        var query = "SELECT product_name, price, stock_quantity FROM products WHERE ?";
        connection.query(query, {item_ID: answer.item_ID},
        function(err, res){
            // Loop through the array it returns and inform the customer what they bought and how much it costs
            for (var i = 0; i < res.length; i++) {
                if(answer.stock_quantity > res[i].stock_quantity){
                    console.log("Sorry, we don't have enough!")
                    purchaseItem();
                }else{
                    console.log("You bought: " + res[i].product_name);
                    userPrice = res[i].price * answer.stock_quantity;
                    console.log("You owe: " + userPrice);
                    var newStockQuantity = res[i].stock_quantity - answer.stock_quantity;
                    connection.query("UPDATE products SET ? WHERE ?", [
                        {
                            stock_quantity: newStockQuantity
                        },
                        {
                            item_ID: answer.item_ID
                        }
                    ]);
                connection.end();
                }

              }
        })
    
    })
};
