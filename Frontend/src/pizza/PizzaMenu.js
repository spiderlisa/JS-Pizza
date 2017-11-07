/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
var $top_row = $(".top-row");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        if (filter == "all-types") {
            pizza_shown.push(pizza);
        }else if (filter == "meat-types") {
            if (pizza.content.meat.length > 0 || pizza.content.chicken.length > 0) pizza_shown.push(pizza);
        }else if (filter == "pineapple-types") {
            if (pizza.content.pineapple.length > 0) pizza_shown.push(pizza);
        }else if (filter == "mushroom-types") {
            if (pizza.content.mushroom.length > 0) pizza_shown.push(pizza);
        }else if (filter == "seafood-types") {
            if (pizza.content.ocean.length > 0) pizza_shown.push(pizza);
        }else if (filter == "vegan-types") {
            if (pizza.content.meat.length == 0 && pizza.content.chicken.length == 0 && pizza.content.ocean.length == 0) pizza_shown.push(pizza);
        }
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List);
    //$top_row.find(".btn").click(filterPizza(event.target.id));
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;