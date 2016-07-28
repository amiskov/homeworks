function log(message) {
    console.log(message);
}

log('Hello from main.js');
'use strict';
$(function () {
    // Ваш код
$.fancybox.showLoading();
    $.ajax({
       url: ".../products.json"
    }).done(function (json) {
        var typeMapper = {
            'promo' : 'Промо-акция',
            'sale' : 'Распродажа',
            'recommended' : 'Рекомендуемые товары'
        };
        var productTemplate = _.template($('#productTemplate').html());
        var products = {};
        var $row;

        for (var i = 0; i < json.length; i ++) {
            if (products[json[i].type] == undefined) {
                products[json[i].type] = [];
            }
            products[json[i].type].push(json[i]);
        }

        for (key in typeMapper) {
            if (products[key] == undefined) {
                continue;
            }
            var $typeDiv = $('#' + key);
            var count = 0;

            $typeDiv.append('<h2>' + typeMapper[key] + '</h2>');

            products[key].forEach(function(item) {
                if (count % 3 == 0) {
                    $typeDiv.append('<div class="row">');
                    $row = $typeDiv.children('div:last')
                }
                $row.append(productTemplate(item));
                count ++;
            });

        }
    }).fail(function (xhr, status, errorThrown) {
        alert("Извините, произошла ошибка. Пожалуйста, обновите страницу и попробуйте еще раз.");
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
    }).always(function (xhr, status) {
        $.fancybox.hideLoading();
    });


});
