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
                egSiteURLMulti,
                setEgSiteURLMulti,
                lobsMulti,
                setLobsMulti,
                regionMulti,
                setRegionMulti,
                brandsMulti,
                deviceTypeMulti,
                setDeviceTypesMulti,
                incidentMulti,
                filterData,
                brandsFilterData,
                annotations,
                isLatencyHealthy,
                sourceLatency,
                anomaliesMulti,
                anomalyAnnotations,
                groupedResByBrands,
                groupedResByLobs
            ] = hook;

            expect(isLoading).eql(true);
            expect(res).eql([]);
            expect(error).eql('');
            expect(egSiteURLMulti).eql({});
            expect(typeof (setEgSiteURLMulti)).eql('function');
            expect(lobsMulti).eql({});
            expect(typeof (setLobsMulti)).eql('function');
            expect(regionMulti).eql({});
            expect(typeof (setRegionMulti)).eql('function');
            expect(brandsMulti).eql({});
            expect(deviceTypeMulti).eql({});
            expect(typeof (setDeviceTypesMulti)).eql('function');
            expect(filterData).eql({});
            expect(brandsFilterData).eql({});
            expect(incidentMulti).eql({});
            expect(annotations).eql([]);
            expect(isLatencyHealthy).eql(true);
            expect(sourceLatency).eql(null);
            expect(anomaliesMulti).eql({});
            expect(anomalyAnnotations).eql([]);
            expect(groupedResByBrands).eql([]);
            expect(groupedResByLobs).eql([]);
        });
    });
});
