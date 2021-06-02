import moment from 'moment';

const triggerEdapPageView = (pagename) => {
    if (typeof window === 'undefined') {
        return;
    }

    if (typeof window.analyticsdatalayer !== 'undefined') {
        window.analyticsdatalayer.pagename = pagename;
    }

    if (typeof window.edap.trigger === 'function') {
        window.edap.trigger('edap.flush');
    }

    window.edap.push((edapInstance) => {
        edapInstance.trigger('pageview');
    });
};

const triggerEdapDateRangeApplied = (eventStartDate, eventEndDate, pagename) => {
    if (typeof window === 'undefined') {
        return;
    }

    window.edap.push((edapInstance) => {
        edapInstance.trigger('datepicker.dates.selected', {
            pagename,
            eventstartdate: moment(eventStartDate).format('YYYY-MM-DD'),
            eventenddate: moment(eventEndDate).format('YYYY-MM-DD'),
            actionlocation: 'date_applied'
        });
    });
};
export {triggerEdapPageView, triggerEdapDateRangeApplied};
