import {OPXHUB_SUPPORT_CHANNEL} from '../../constants';

export const METRIC_NAMES = ['SearchSuccessRate', 'SERPSuccessRate', 'PDPSuccessRate', 'checkoutSuccessRate'];

export const EPS_PARTNER_TPIDS = [
    {label: 'RBC', value: '70205'},
    {label: 'Chase', value: '70501'}
];

export const AVAILABLE_LOBS = ['H', 'C', 'F', 'CR', 'P', 'A'];

export const getErrorMessage = (selectedBrand) => {
    return `Success rates for ${selectedBrand} is not yet available.
                If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`;
};
