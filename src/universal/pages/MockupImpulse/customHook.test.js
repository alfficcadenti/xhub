/* eslint-disable no-unused-expressions */
/* eslint-disable no-undefined */
import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme/build';
import {func} from 'prop-types';
import {useFetchBlipData} from './customHook';

function HookWrapper(props) {
    const hook = props.hook ? props.hook() : undefined;
    return <div hook={hook}/>;
}

HookWrapper.propTypes = {
    hook: func
};

describe('Impulse custom hooks', () => {
    it('should render', () => {
        let wrapper = shallow(<HookWrapper/>);
        expect(wrapper.exists()).to.be.ok;
    });

    describe('test useFetchBlipData hook', () => {
        it('fetch impulse data successfully', () => {
            const wrapper = shallow(<HookWrapper hook={() => useFetchBlipData()}/>);
            let {hook} = wrapper.find('div').props();
            let [
                isLoading,
                res,
                error,
                bookingTypes,
                egSiteUrls,
                deviceTypes,
                brands,
                lobs
            ] = hook;

            expect(isLoading).eql(true);
            expect(res).eql([]);
            expect(bookingTypes).eql([]);
            expect(egSiteUrls).eql([]);
            expect(deviceTypes).eql([]);
            expect(brands).eql([]);
            expect(lobs).eql([]);
            expect(error).eql('');
        });
    });
});
