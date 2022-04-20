import {OPXHUB_SUPPORT_CHANNEL} from '../../constants';


export const getErrorMessage = (selectedBrand) => {
    return `Page views for ${selectedBrand} is not yet available.
        The following brands are supported at this time: "Expedia", "Hotels.com Retail", and "Vrbo Retail".
        If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`;
};
