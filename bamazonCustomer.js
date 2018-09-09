var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Z410812d",
	database: "bamazon_db"
});

connection.connect(function(err) {

	if (err) {
		console.log("Database connection failed");
		throw err;
	}
	    console.log("Connected as id: ", connection.threadId);
	start();
})

function start() {
	connection.query("SELECT `ID`, `product_name`, `price` FROM product", function(err, res){
		if(err) throw err;
		console.log("Please select from the products below:")
		console.log("----------------------------------------------------")
	  
		for(var i = 0; i<res.length;i++){
		  console.log("ID: " + res[i].ID + " | " + "Product: " + res[i].product_name + " | " + "Price: " + res[i].price);
		}

		inquirer.prompt([{
			name: "item",
			type: "input",
			message: "What is the ID of the product you'd like?",
			validate: function(value) {

				for (var i=0; i<res.length; i++) {

					if (value == res[i].ID) {

						return true;
					}}
				return "Please check the ID again";
			}}, {

			name: "quantity",
			type: "input",
			message: "How many would you like?",
			validate: function(value) {

				if (isNaN(value) == false) {
					return true;
				} else {
					return "Please enter a number!";
				}}

		}]) .then(function(answer) {
			var idChosen = answer.item;
			var qtyChosen = answer.quantity;
			var totalCost = res[idChosen].price*qtyChosen;

            if (qtyChosen < res[idChosen].stock_quantity) {
                connection.query("UPDATE product SET ? WHERE ?", [{
                    stock_quantity : res[idChosen].stock_quantity - qtyChosen
                }, {
                    ID : checkup.item}
			  ], function(err, result){
				  if(err) throw err;
				  console.log("Thanks! Your total is $" + totalCost);
			  });
			} else{
			  console.log("Sorry, we don't have that much in stock.");
			}
	  
			reprompt();
		  })
	  })
	  }

	  function reprompt(){
		inquirer.prompt([{
		  name: "reply",
		  type: "confirm",
		  message: "Would you like to purchase another item?"
		}]).then(function(ans){
		  if(ans.reply){
			start();
		  } else{
			console.log("Come back soon");
		  }
		});
	  }


