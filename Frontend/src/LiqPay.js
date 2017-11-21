/**
 * created by lisa on 21.11.17
 */

var initialize = function(data, signature) {
    LiqPayCheckout.init({
        data: data,
        signature: signature,
        embedTo: "#liqpay",
        mode: "popup"
    }).on("liqpay.callback", function(data){
        console.log(data.status);
        console.log(data);
    }).on("liqpay.ready", function(data){
        // ready
    }).on("liqpay.close", function(data){
        // close
        if (data.result) {
            alert("Замовлення оформлено. Дякуємо за користування онлайн сервісом.");
            document.location.href = "http://localhost:5050/";
            $("#clear").click();
        }
    });
};

exports.initialize = initialize;

