'use strict';
$(function () {
    // Ваш код
    $.ajax({
        dataType: 'json',
        url: 'products.json',
        beforeSend: function () {
            $.fancybox.showLoading();
        }

    }).done(function (data) {
        var types = {
            sale: 'Распродажа',
            promo: 'Промо-акция',
            recommended: 'Рекомендуемые товары'
        };
        var sale = [];
        var promo = [];
        var recommended = [];
        data.forEach(function (item) {
            if (item.type == 'sale') {
                sale.push(item);
            } else if (item.type == 'promo') {
                promo.push(item);
            } else if (item.type == 'recommended') {
                recommended.push(item);
            }
        });


            var tmpl = _.template(document.getElementById('productTemplate').innerHTML);

            $('#sale').append(tmpl({title: 'Распродажа', products: sale}));
            $('#promo').append(tmpl({title: 'Промо-акция', products: promo}));
            $('#recommended').append(tmpl({title: 'Рекомендованные товары', products: recommended}));
        })
        .fail(function () {
            console.log('Произошла какая-то ошибка');
        })
        .always(function () {
            $.fancybox.hideLoading();
        });
});
