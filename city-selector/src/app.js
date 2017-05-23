const $ = require('jquery');
const CitySelector = require('./CitySelector');
let citySelector;


$('#citySelector').on('click', () => {
    // alert('test');
});

const $info = $('#info');

$('#createCitySelector').on('click', () => {
    if (citySelector) {
        console.log('citySelector already exists.');
        return;
    }

    citySelector = new CitySelector({
        elementId: 'citySelector',
        regionsUrl: 'http://localhost:3000/regions',
        localitiesUrl: 'http://localhost:3000/localities',
        saveUrl: 'http://localhost:3000/selectedRegions'
    });

    citySelector.$container
        .on('citySelector:create', (ev, data) => {
            console.log('CitySelector has been created');
            $info.show();
        })
        .on('citySelector:update', (ev, data) => {
            $info.find('.info__text').html(`Регион: ${data.regionId}<br> Населенный пункт: ${data.localityName}`);
        })
        .on('citySelector:destroy', () => {
            $info.hide();
        });
});

$('#destroyCitySelector').on('click', () => {
    if (citySelector) {
        citySelector.destroy();
        citySelector = null;
    }
});

// 2nd instance
// new CitySelector({
//     elementId: 'ololo',
//     regionsUrl: 'http://localhost:3000/regions',
//     localitiesUrl: 'http://localhost:3000/localities',
//     saveUrl: 'http://localhost:3000/selectedRegions'
// });