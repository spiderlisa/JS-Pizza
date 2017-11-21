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

var GoogleMaps = require('../GoogleMaps');
var LiqPay = require('../LiqPay');

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
    GoogleMaps.geocodeAddress($("#inputAddress").val(), function(err, location){
        if(err){
            alert("Не вдалося встановити адресу.");
            $(".address-group").removeClass("has-success").addClass("has-error");
            $(".address-group").find(".help-block").css("display", "inline-block");

            $(".order-time").text("невідомий");
            $(".order-address").text("невідома");
        }else {
            GoogleMaps.calculateRoute(new google.maps.LatLng(50.464379, 30.519131), location, function(err, data){
                if(!err){
                    $(".order-time").text(data.duration.text);
                }else {
                    console.log(err);
                }
            });

            $(".address-group").removeClass("has-error").addClass("has-success");
            $(".address-group").find(".help-block").css("display", "none");

            contact_info.address = $("#inputAddress").val();
            Storage.set("info", contact_info);

            $(".order-address").text($("#inputAddress").val());
        }
    });
}

function readData() {
    addressValid();
    var valid = nameValid() && phoneValid() && $(".order-time").text()!="невідомий";
    if (valid) {
        API.createOrder({
            name: $("#inputName").val(),
            phone: $("#inputPhone").val(),
            address: $("#inputAddress").val(),
            order: PizzaCart.getPizzaInCart()
        }, function(err, data){
            if(err) {
                alert("Щось пішло не так...");
                return console.log("API.createOrder() failed. Call in PizzaOrder.js.");
            }else {
                window.LiqPayCheckoutCallback = LiqPay.initialize(data.data, data.signature);
            }
        });
    }else {
        alert("Будь ласка, заповніть всі поля.");
    }
}

function initializeOrder() {
    var contact_info = Storage.get("info");
    if (contact_info) {
        if (contact_info.name) {
            $("#inputName").val(contact_info.name);
            nameValid();
        }
        if (contact_info.phone) {
            $("#inputPhone").val(contact_info.phone);
            phoneValid();
        }
        if (contact_info.address) {
            $("#inputAddress").val(contact_info.address);
            addressValid();
        }
    }

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

$("#inputAddress").keyup(function(key) {
    if (key.keyCode == 13) addressValid()
});

$next.click(function() {
    readData()
});

exports.initializeOrder = initializeOrder;










