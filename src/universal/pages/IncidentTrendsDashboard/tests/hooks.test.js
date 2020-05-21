/* eslint-disable no-unused-expressions */
/* eslint-disable no-undefined */
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
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
                allUniqueIncidents,
                allIncidents,
                allUniqueDefects,
                allDefects,
                incidentsPriorities,
                defectsPriorities,
                incidentsStatuses,
                defectsStatuses,
            ] = hook;

            expect(isLoading).eql(true);
            expect(allIncidents).eql([]);
            expect(allUniqueIncidents).eql([]);
            expect(allUniqueDefects).eql([]);
            expect(allDefects).eql([]);
            expect(incidentsPriorities).eql([]);
            expect(defectsPriorities).eql([]);
            expect(incidentsStatuses).eql([]);
            expect(defectsStatuses).eql([]);
            expect(error).eql('');
        });
    });
});
