/* eslint-disable no-unused-expressions */
/* eslint-disable no-undefined */
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme/build';
import {func} from 'prop-types';
import {HOTELS_COM_BRAND} from '../../../constants';
import {useFetchTickets, useRootCauseOwner} from '../hooks';

function HookWrapper(props) {
    const hook = props.hook ? props.hook() : undefined;
    return <div hook={hook} />;
}

HookWrapper.propTypes = {
    hook: func
};

describe('Incident Trends Dashboard custom hooks', () => {
    it('should render', () => {
        let wrapper = shallow(<HookWrapper />);
        expect(wrapper.exists()).to.be.ok;
    });

    it('useFetchTickets', () => {
        const wrapper = shallow(<HookWrapper hook={() => useFetchTickets()} />);
        const {hook} = wrapper.find('div').props();
        let [
            isLoading,
            error,
            allUniqueTickets,
            allTickets,
            priorities,
            statuses,
        ] = hook;
        expect(isLoading).eql(true);
        expect(allTickets).eql([]);
        expect(allUniqueTickets).eql([]);
        expect(priorities).eql([]);
        expect(statuses).eql([]);
        expect(error).eql('');
    });

    it('useRootCauseOwner', () => {
        const tickets = [{impacted_brand: 'Hotels', 'RC Owner': 'bob'}, {impacted_brand: 'vrbo', 'RC Owner': 'joe'}];
        const wrapper = shallow(<HookWrapper hook={() => useRootCauseOwner(HOTELS_COM_BRAND, tickets)} />);
        const {hook} = wrapper.find('div').props();
        expect(hook).to.eql([]);
    });
});
