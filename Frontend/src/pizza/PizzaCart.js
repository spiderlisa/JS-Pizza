/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];
var sum = 0;

//local storage
var Storage = require('../LocalStorage');
var orders = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");
var $header = $("#cart-header");
var $bottom = $("#cart-bottom");
var $order = $("#orders");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    var has = false;
    function check(item) {
        if (pizza == item.pizza && size == item.size) {
            has = true;
            item.quantity += 1;
        }
    }

    Cart.forEach(check);

    if (has == false || Cart.length == 0) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    function notThisItem(item) {
        return item != cart_item;
    }
    Cart = Cart.filter(notThisItem);

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    var orders = Storage.get("cart");
    if (orders) {
        Cart = orders;
    }

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Очищаємо старі піци в кошику
    $order.html("");
    $cart.html("");
    sum = 0;

    //Оновлення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function() {
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function() {
            //Збільшуємо кількість замовлених піц
            if (cart_item.quantity == 1) removeFromCart(cart_item);
            else cart_item.quantity -= 1;
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".delete").click(function() {
            removeFromCart(cart_item);
            updateCart();
        });

        if (document.location.href == "http://localhost:5050/order.html") {
            $node.find(".plus").css("display", "none");
            $node.find(".minus").css("display", "none");
            $node.find(".delete").css("display", "none");
            var piz = "";
            if (cart_item.quantity==1) piz = "піца";
            else if (cart_item.quantity % 10 == 2 || cart_item.quantity % 10 == 3 || cart_item.quantity % 10 == 4) piz = "піци";
            else piz = "піц";
            $node.find("#quantity").text(cart_item.quantity + " " + piz);
        }else {
            $node.find(".plus").css("display", "inline-block");
            $node.find(".minus").css("display", "inline-block");
            $node.find(".delete").css("display", "inline-block");
            $node.find("#quantity").text(cart_item.quantity);
        }

        $order.append($node);
    }

    function calculateSum(cart_item) {
        sum += Number.parseInt(cart_item.pizza[cart_item.size].price) * Number.parseInt(cart_item.quantity);
    }

    if (document.location.href == "http://localhost:5050/order.html") {
        $header.find("#clear").css("visibility", "hidden");
    }else {
        $header.find("#clear").css("visibility", "visible");
    }
    $header.find(".badge").text(Cart.length);
    $header.find("#clear").click(function() {
        Cart.forEach(removeFromCart);
    });
    $cart.append($header);

    if (Cart.length < 1) {
        $order.html("<div class=\"empty-cart\" id = \"empty-fridge\">\n" +
            "            Пусто в холодильнику?\n" +
            "            <br>\n" +
            "            Замовте піцу!\n" +
            "            </div>");
        $("#submit-order").attr("disabled", true);
    } else {
        Cart.forEach(showOnePizzaInCart);
        $("#submit-order").attr("disabled", false);
    }
    $cart.append($order);

    Cart.forEach(calculateSum);
    $bottom.find("#sum").text(sum + " грн");
    $cart.append($bottom);

    orders = Cart;
    Storage.set("cart", orders);

    $("#submit-order").click(function () {
        document.location.href = "http://localhost:5050/order.html";
    });
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;