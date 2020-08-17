import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import ReferenceLabel from '../index';

const annotation = {
    time: 'testTime',
    number: 'testNumber',
    tags: [],
    serviceName: 'testServiceName'
};

describe('ReferenceLabel component testing', () => {
    it('checks ReferenceLabel component exists', () => {
        const wrapper = shallow(<ReferenceLabel
            annotation={annotation}
        />);

        expect(wrapper).to.have.length(1);
    });
});
