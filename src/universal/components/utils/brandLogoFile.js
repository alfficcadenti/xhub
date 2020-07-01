// eslint-disable-next-line consistent-return
export default function brandLogoFile(brand) {
    const brandsArray = ['Vrbo', 'egencia', 'Hotels.com', 'Expedia'];
    try {
        if (brandsArray.includes(brand)) {
            return require(`../../img/logo-${brand.toLowerCase()}.png`).default;
        }
    } catch {
        return null;
    }
}