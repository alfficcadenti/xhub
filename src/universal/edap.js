import moment from 'moment';
import edapWrapper from '@homeaway/edap-wrapper';

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

    edapWrapper().push({
        name: 'pageview',
        data: {eventcategory: 'component', eventaction: 'view-toggle'},
        options: {}
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
