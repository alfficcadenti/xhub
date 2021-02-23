module.exports = {
    url: 'http://localhost:8080/impulse?selectedBrand=Expedia%20Group',
    elements: {
        brandSelector: '#brand-selector',
        dropdownMenuOpen: '.Dropdown__menu--open'
    },
    commands: [{
        selectBrand(id) {
            return this
                .click('@brandSelector')
                .click(`.Dropdown__menu--open li:nth-child(${id})`);
        }
    }]
};