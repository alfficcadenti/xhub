/* eslint-disable no-unused-expressions */
/* eslint-disable no-undefined */
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme/build';
import {func} from 'prop-types';
import {useIsMount, useFetchTickets} from '../hooks';

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

    describe('test useIsMount hook', () => {
        it('useIsMount is correct', () => {
            const wrapper = shallow(<HookWrapper hook={() => useIsMount()} />);

            let {hook} = wrapper.find('div').props();
            let isMount = hook;

            expect(isMount).eql(true);
        });
    });

    describe('test useFetchTickets hook', () => {
        it('fetch tickets successfully', () => {
            const wrapper = shallow(<HookWrapper hook={() => useFetchTickets()} />);

            let {hook} = wrapper.find('div').props();
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
    });
});
