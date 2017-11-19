/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');
var API = require('../API');

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

        $node.find(".buy-big").click(function (e) {
            e.preventDefault();
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });

        $node.find(".buy-small").click(function (e) {
            e.preventDefault();
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function (pizza) {
        if (filter == "all") {
            pizza_shown.push(pizza);
        }else if (filter == "vegan") {
            if (!pizza.content.meat && !pizza.content.chicken && !pizza.content.ocean) pizza_shown.push(pizza);
        }else {
            if (pizza.content[filter]) pizza_shown.push(pizza);
        }
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);

    $top_row.find("#by-type").text(pizza_shown.length);
}

function initialiseMenu() {
    $top_row.find(".btn").click(function() {
        $top_row.find(".btn").removeClass('pressed');
        $(this).addClass('pressed');
        filterPizza(event.target.id);
    });

    showPizzaList(Pizza_List);

    var $home = $(".top-label");
    $home.click(function () {
        location.reload();
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;