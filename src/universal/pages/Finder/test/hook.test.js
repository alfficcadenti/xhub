/* eslint-disable no-unused-expressions */
/* eslint-disable no-undefined */
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme/build';
import {func} from 'prop-types';
import {useFetchCRs} from '../hooks';

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

    describe('test useFetchCRs hook', () => {
        it('fetch CRs successfully', () => {
            const wrapper = shallow(<HookWrapper hook={() => useFetchCRs()} />);

            let {hook} = wrapper.find('div').props();
            let [
                isLoading,
                error,
                allUniqueCRs,
                allCRs,
                priorities,
                categories,
                teams
            ] = hook;

            expect(isLoading).eql(true);
            expect(allCRs).eql([]);
            expect(allUniqueCRs).eql([]);
            expect(priorities).eql([]);
            expect(categories).eql([]);
            expect(teams).eql([]);
            expect(error).eql('');
        });
    });
});
