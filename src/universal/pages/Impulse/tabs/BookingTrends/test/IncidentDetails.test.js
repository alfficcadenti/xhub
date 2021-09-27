import IncidentDetails from '../sections/IncidentTable/IncidentDetails';
import {shallow} from 'enzyme';
import React from 'react';
import chai, {expect} from 'chai';
import chaiJestSnapshot from 'chai-jest-snapshot';
import fakeData from './incidentData.test.json';

chai.use(chaiJestSnapshot);

describe('Incident Details component testing', () => {
    let wrapper;

    beforeEach(() => {
        chaiJestSnapshot.setFilename(`${__filename}.snap`);
        wrapper = shallow(
            <IncidentDetails data ={fakeData} />
        );
    });
    afterEach(() => {
        wrapper.unmount();
    });


    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});
