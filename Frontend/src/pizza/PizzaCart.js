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
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $order.html("");
    $cart.html("");

    //Оновлення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц
            if (cart_item.quantity == 1) removeFromCart(cart_item);
            else cart_item.quantity -= 1;
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".delete").click(function () {
            removeFromCart(cart_item);
            updateCart();
        })

        $order.append($node);
    }

    function calculateSum(cart_item) {
        sum += Number.parseInt(cart_item[size].price); //???????????????????????
    }

    $header.find(".badge").text(Cart.length);
    $header.find("#clear").click(function () {
        Cart.forEach(removeFromCart);
    });
    $cart.append($header);

    Cart.forEach(showOnePizzaInCart);
    $cart.append($order);

    //Cart.forEach(calculateSum);
    //$bottom.find("#sum").text(sum);
    $cart.append($bottom);

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;