const $ = require('jquery');
require('./style.less');

const mainClass = 'city-selector';
const activeClass = '_active';

const {renderButton, renderRegions, renderLocalities, renderSaveForm} = require('./templates')(mainClass);

class CitySelector {
    constructor(options) {
        const {elementId, regionsUrl, localitiesUrl, saveUrl} = options;

        this.$container = $('#' + elementId)
            .addClass(mainClass)
            .html(renderButton());

        this.$container
            .on('click', '.js-select-btn', {regionsUrl}, this.loadRegions.bind(this))
            .on('click', '.js-region', {localitiesUrl}, this.loadLocalities.bind(this))
            .one('click', '.js-locality', {saveUrl}, this.showSaveForm.bind(this))
            .on('click', '.js-locality', this.activateTarget.bind(this))
            .on('selection:update', {
                // сохранять id региона и название пункта в this.$container.data
                regionId: this.$container.find('.js-region._active').data('id'),
                localityName: this.$container.find('.js-locality._active').text()
            }, this.fillFormFields.bind(this));
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

        this.activateTarget(ev);
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

    fillFormFields(ev) {
        console.log(ev.data);
        const {regionId, localityName} = ev.data;
        console.log(regionId, localityName);

        const $form = $('#saveForm');

        $form.find('[name="region"]').val(regionId);
        $form.find('[name="locality"]').val(localityName);
    }

    activateTarget(ev) {
        const $el = $(ev.currentTarget);

        $el
            .addClass(activeClass)
            .siblings().removeClass(activeClass);

        this.$container.triggerHandler('selection:update');
    }

    destroy() {
        this.$container.remove();
        // если бы создавали из существующего кода HTML, то убирали бы обработчики событий
        // and then delete class instance: `delete citySelectorObj`
    }
}


module.exports = CitySelector;