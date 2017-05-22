module.exports = function (className) {
    return {
        renderButton() {
            console.log(className);
            return `<button class="${className}__btn js-select-btn">Выбрать регион</button>`;
        },

        renderRegions(regions) {
            const list = regions.map(region => {
                return `<li class="js-region" data-id="${region.id}">${region.title}</li>`
            });

            return `<ul class="${className}__regions js-regions">${list.join('')}</ul>`;
        },

        renderLocalities(localities) {
            const list = localities.map(locality => {
                return `<li class="js-locality">${locality}</li>`;
            });

            return `<ul class = "${className}__localities js-localities" >${list.join('')}</ul>`;
        },

        renderSaveForm(saveUrl) {
            return `
               <form id="saveForm" method="post" action="${saveUrl}">
                    <input type="hidden" name="region">
                    <input type="hidden" name="locality">
                    <input type="submit" value="Сохранить">
                </form>`;
        }
    }
};