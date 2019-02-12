create database bamazon;

use bamazon;

create table products(
	item_id integer auto_increment not null,
    product_name varchar(30),
    department_name varchar(30),
    price integer,
    stock_quantity integer,
    primary key (item_id)
    );
    
select * from products;

