const $ = require('jquery');
const {renderButton, renderRegions, renderLocalities, renderSaveForm} = require('./templates')('city-selector');
require('./style.less');

// Можно обновлять форму по кастомному событию, которое будут генерить регионы и
// нас. пункты при выделении. В это событие будет передаваться id региона и название города

class CitySelector {
    constructor(options) {
        const {elementId, regionsUrl, localitiesUrl, saveUrl} = options;

        this.$container = $('#' + elementId)
            .addClass('city-selector')
            .html(renderButton());

        this.$container
            .on('click', '.js-select-btn', {regionsUrl}, this.loadRegions.bind(this))
            .on('click', '.js-region', {localitiesUrl}, this.loadLocalities.bind(this))
            .one('click', '.js-locality', {saveUrl}, this.showSaveForm.bind(this))
            .on('click', '.js-locality', activateTarget);
    }

    loadRegions(ev) {
        this.sendRequest(ev.data.regionsUrl).done((resp) => {
            this.$container.html(renderRegions(resp));
        });
    }

    loadLocalities(ev) {
        const regionId = $(ev.currentTarget).data('id');

        this.sendRequest(ev.data.localitiesUrl + '/' + regionId).done((resp) => {
            this.$container
                .find('.js-localities').remove().end()
                .append(renderLocalities(resp.list));
        });

        activateTarget(ev);
    }

    showSaveForm(ev) {
        this.$container.append(renderSaveForm(ev.data.saveUrl));
    }

    sendRequest(url) {
        return $.ajax({
            url: url,
            beforeSend() {
                console.log('Let \'s send!')
            }
        }).always(() => {
            console.log('Done!')
        }).fail(() => {
            console.log('Sorry, something went wrong');
        });
    }

    destroy() {
        this.$container.remove();
        // если бы создавали из существующего кода HTML, то убирали бы обработчики событий
        // and then delete class instance: `delete citySelectorObj`
    }
}

function fillFormFields($regions, $localities) {
    const regionId = $regions.filter('._active').data('id');
    const localityName = $localities.filter('._active').text();

    const $form = $('#saveForm');
    $form.find('[name="region"]').val(regionId);
    $form.find('[name="locality"]').val(localityName);
}

function activateTarget(ev) {
    const $el = $(ev.currentTarget);

    $el
        .addClass('_active')
        .siblings().removeClass('_active');

    fillFormFields($('.js-region'), $('.js-locality'));
}


module.exports = CitySelector;