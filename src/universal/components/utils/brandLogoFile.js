import {EXPEDIA_BRAND, VRBO_BRAND, HOTELS_COM_BRAND, EGENCIA_BRAND} from '../../pages/constants';

// eslint-disable-next-line consistent-return
export default function brandLogoFile(brand) {
    const brandsArray = [VRBO_BRAND, EGENCIA_BRAND, HOTELS_COM_BRAND, EXPEDIA_BRAND];
    try {
        if (brandsArray.includes(brand)) {
            return require(`../../img/logo-${brand.toLowerCase()}.png`).default;
        }
    } catch {
        return null;
    }
}