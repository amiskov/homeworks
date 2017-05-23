module.exports = {
    renderLayout(className, saveUrl) {
        return (
            `<button class="${className}__btn js-select-btn">Выбрать регион</button>
                <ul class="${className}__regions js-regions"></ul>
                <ul class = "${className}__localities js-localities" ></ul>
                <form class="${className}__save-form _hidden js-save-form" method="post" action="${saveUrl}">
                    <input type="hidden" name="region">
                    <input type="hidden" name="locality">
                    <input type="submit" value="Сохранить">
                </form>`
        );
    },


    renderButton() {
        return `<button class="${className}__btn js-select-btn">Выбрать регион</button>`;
    },

    renderRegions(regions) {
        return regions.map(region => {
            return `<li class="js-region" data-id="${region.id}">${region.title}</li>`
        });

        // return `<ul class="${className}__regions js-regions">${list.join('')}</ul>`;
    },

    renderLocalities(localities) {
        return localities.map(locality => {
            return `<li class="js-locality">${locality}</li>`;
        });

        // return `<ul class = "${className}__localities js-localities" >${list.join('')}</ul>`;
    },

    renderSaveForm(saveUrl) {
        return `
               <form id="saveForm" method="post" action="${saveUrl}">
                    <input type="hidden" name="region">
                    <input type="hidden" name="locality">
                    <input type="submit" value="Сохранить">
                </form>`;
    }
};