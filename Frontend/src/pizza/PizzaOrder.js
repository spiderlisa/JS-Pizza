/**
 * created by lisa on 17.11.17
 */

var API = require('../API');
var PizzaCart = require('./PizzaCart');

var Storage = require('../LocalStorage');
var contact_info = {
    name: "",
    phone: "",
    address: ""
};

var $next = $("#next-button");

function nameValid() {
    if (!/^[0-9A-Za-zА-Яа-яІіЇїЄєҐґ'/ -]+$/.test($("#inputName").val())) {
        $(".name-group").removeClass("has-success").addClass("has-error");
        $(".name-group").find(".help-block").css("display", "inline-block");
        return false;
    }else {
        $(".name-group").removeClass("has-error").addClass("has-success");
        $(".name-group").find(".help-block").css("display", "none");
        contact_info.name = $("#inputName").val();
        Storage.set("info", contact_info);
        return true;
    }
}

function phoneValid() {
    if ((! /^[+]?(38)?([0-9]{10})$/.test($("#inputPhone").val()) && (! /^0?([0-9]{9})$/.test($("#inputPhone").val())))) {
        $(".phone-group").removeClass("has-success").addClass("has-error");
        $(".phone-group").find(".help-block").css("display", "inline-block");
        return false;
    }else {
        $(".phone-group").removeClass("has-error").addClass("has-success");
        $(".phone-group").find(".help-block").css("display", "none");
        contact_info.phone = $("#inputPhone").val();
        Storage.set("info", contact_info);
        return true;
    }
}

function addressValid() {
    if ($("#inputAddress").val().length < 1) {
        $(".address-group").removeClass("has-success").addClass("has-error");
        $(".address-group").find(".help-block").css("display", "inline-block");
        return false;
    }else {
        $(".address-group").removeClass("has-error").addClass("has-success");
        $(".address-group").find(".help-block").css("display", "none");
        contact_info.address = $("#inputAddress").val();
        Storage.set("info", contact_info);
        return true;
    }
}

function readData() {
    var valid = nameValid($("#inputName").val()) && phoneValid($("#inputPhone").val()) && addressValid($("#inputAddress").val());
    if (valid) {
        API.createOrder({
            name: $("#inputName").val(),
            phone: $("#inputPhone").val(),
            address: $("#inputAddress").val(),
            order: PizzaCart.getPizzaInCart(),
        }, function(err){
            if(err) {
                alert("Oops! Something went wrong...");
                return console.log("API.createOrder() failed. Call in PizzaOrder.js.");
            }
            alert("Order successfully placed!");
        });
    }else {
        alert("Please, fill in the input fields.");
    }
}

function initializeOrder() {
    /*var contact_info = Storage.get("info");
    if (contact_info) {
        if (contact_info.name) {
            $name.val(contact_info.name);
        }
        if (contact_info.phone) {
            $phone.val(contact_info.phone);
        }
        if (contact_info.address) {
            $address.val(contact_info.address);
        }
    }*/


    $("#return-to-list").click(function () {
        document.location.href = "http://localhost:5050/";
    });
}

$("#inputName").keyup(function() {
    nameValid()
});

$("#inputPhone").keyup(function() {
    phoneValid()
});

$("#inputAddress").keyup(function() {
    addressValid()
});

$next.click(function() {
    readData()
});

exports.initializeOrder = initializeOrder;










