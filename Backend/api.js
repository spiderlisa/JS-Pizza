/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var public_key = "i71437369028";
var private_key = "1i2Tdr6Ke4SLOIAyEV9BiA1oHu6GhowLSQ4dMhLY";
var crypto = require('crypto');

function base64(str) {
    return new Buffer(str).toString('base64');
}

function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating order: ", order_info);

    var price = 0;
    function sum(cart_item) {
        price += Number.parseInt(cart_item.pizza[cart_item.size].price) * Number.parseInt(cart_item.quantity)
    }
    order_info.order.forEach(sum);

    var pizza_list = "";
    function pizzas(cart_item) {
        pizza_list += cart_item.pizza.title + ", " + (cart_item.size=="big_size" ? "велика" : "мала") + ", " + cart_item.quantity + "\n"
    }
    order_info.order.forEach(pizzas);

    var order = {
        version: 3,
        public_key:	public_key,
        action: "pay",
        amount:	price,
        currency: "UAH",
        description: order_info.name + "\nтел. " + order_info.phone + "\nадр. " + order_info.address + "\nВСЬОГО " + price + "грн\nЗамовлення:\n" + pizza_list,
        order_id: Math.random(),
        sandbox: 1
    };

    var data = base64(JSON.stringify(order));
    var signature = sha1(private_key + data + private_key);

    res.send({
        data: data,
        signature: signature,
        success: true
    });
};