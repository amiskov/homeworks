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

        // Клонируем элемент в первоначальном состоянии, чтобы сохранить все классы и верстку
        // и при дестрое возвращать все как было.
        // Если нужно сохранить и навешенные оработчики, то вызываем `.clone(true)`
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
            // Без таймаута элемент не успевает добавляться в DOM.
            // Событие триггерится, но слушатели не могут его поймать.
            this.$container.triggerHandler('citySelector:create');
        });
    }

    loadRegions(ev) {
        const $btn = $(ev.currentTarget);
        sendRequest(ev.data.regionsUrl).done((resp) => {
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

        sendRequest(ev.data.localitiesUrl + '/' + regionId).done((resp) => {
            this.$localities.html(renderLocalities(resp.list));
        });
    }

    selectLocality(ev) {
        if (isItemActive(ev)) {
            return;
        }

        activateTarget(ev);
        this.triggerUpdate();
    }

    triggerUpdate(data = {}) {
        let {regionId, localityName} = data;

        // Если `data` не приходит, то проходимся по спискам и собираем элементы с классом `_active`.
        // `regionId` может быть задан как пустая строка, поэтому сравниваем с `undefined`.
        regionId = (regionId !== undefined) ? regionId : this.$regions.find('.' + activeClass).data('id');
        localityName = (localityName !== undefined) ? localityName : this.$localities.find('.' + activeClass).text();

        this.$container.triggerHandler(updateSelectionEvent, {regionId, localityName});
    }

    fillFormFields(ev, data) {
        const {regionId, localityName} = data;

        if (localityName !== '') {
            this.$saveForm.filter(':hidden').removeClass('_hidden');
        }

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

function sendRequest(url) {
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

module.exports = CitySelector;