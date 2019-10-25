/* istanbul ignore next */
export default {
    tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
    },
    legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 20,
        top: 20,
        bottom: 20
    },
    series: [
        {
            name: '',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [],
            animation: false
        }
    ]
};
