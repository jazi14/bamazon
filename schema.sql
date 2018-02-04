USE bamazon;

CREATE TABLE products (
item_ID INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price DECIMAL(65, 2) NOT NULL,
stock_quantity INTEGER(111) NOT NULL,
PRIMARY KEY (item_ID)
);