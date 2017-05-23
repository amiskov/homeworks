const $ = require('jquery');
require('./style.less');

const {renderLayout, renderRegions, renderLocalities} = require('./templates');

const mainClass = 'city-selector';
const activeClass = '_active';
const updateSelectionEvent = 'citySelector:update';

class CitySelector {
    constructor(options) {
        const {elementId, regionsUrl, localitiesUrl, saveUrl} = options;

        this.$container = $('#' + elementId);

        // Клонируем, чтобы сохранить все классы и верстку. Но без обработчиков, если они есть.
        // При дестрое вернем все как было.
        this.$innocentContainer = this.$container.clone();

        this.$container.addClass(mainClass)
            .html(renderLayout(mainClass, saveUrl));

        this.$regions = this.$container.find('.js-regions');
        this.$localities = this.$container.find('.js-localities');
        this.$saveForm = this.$container.find('.js-save-form');

        this.$container
            .on('click', '.js-select-btn', {regionsUrl}, this.loadRegions.bind(this))
            .on('click', '.js-region', {localitiesUrl}, this.selectRegion.bind(this))
            .on('click', '.js-locality', this.selectLocality.bind(this))
            .on(updateSelectionEvent, this.fillFormFields.bind(this));

        setTimeout(() => {
            // Без таймаута не элемент успевает добавляться в DOM.
            // Событие триггерится, но слушатели не могут его поймать.
            this.$container.triggerHandler('citySelector:create');
        });
    }

    loadRegions(ev) {
        const $btn = $(ev.currentTarget);
        this.sendRequest(ev.data.regionsUrl).done((resp) => {
            this.$regions.html(renderRegions(resp));
            $btn.remove();
        });
    }

    selectRegion(ev) {
        const regionId = $(ev.currentTarget).data('id');

        if (isItemActive(ev)) {
            return;
        }

        activateTarget(ev);
        this.triggerUpdate({localityName: ''});

        this.sendRequest(ev.data.localitiesUrl + '/' + regionId).done((resp) => {
            this.$localities.html(renderLocalities(resp.list));
        });

    }

    triggerUpdate(data = {}) {
        let {regionId, localityName} = data;

        regionId = (regionId !== undefined) ? regionId : this.$regions.find('.' + activeClass).data('id');
        localityName = (localityName !== undefined) ? localityName : this.$localities.find('.' + activeClass).text();

        this.$container.triggerHandler(updateSelectionEvent, {regionId, localityName});
    }

    selectLocality(ev) {
        if (isItemActive(ev)) {
            return;
        }
        activateTarget(ev);
        this.triggerUpdate();
        this.$saveForm.filter(':hidden').removeClass('_hidden');
    }

    showSaveForm(ev) {
        this.$container.append(renderSaveForm(ev.data.saveUrl));
    }

    sendRequest(url) {
        return $.ajax({
            url: url,
            beforeSend() {
                console.log('Show loading spinner.');
            }
        }).always(() => {
            console.log('Hide loading spinner.');
        }).fail(() => {
            console.log('Sorry, something went wrong');
        });
    }

    fillFormFields(ev, data) {
        const {regionId, localityName} = data;
        this.$saveForm
            .find('[name="region"]').val(regionId)
            .end()
            .find('[name="locality"]').val(localityName)
            .end()
            .find('[type="submit"]').prop('disabled', localityName === '');
    }

    destroy() {
        this.triggerUpdate({regionId: '', localityName: ''});
        this.$container.triggerHandler('citySelector:destroy');
        this.$container.replaceWith(this.$innocentContainer);
    }
}

function isItemActive(ev) {
    return $(ev.currentTarget).hasClass(activeClass);
}

function activateTarget(ev) {
    const $el = $(ev.currentTarget);
    $el.addClass(activeClass).siblings().removeClass(activeClass);
}

module.exports = CitySelector;