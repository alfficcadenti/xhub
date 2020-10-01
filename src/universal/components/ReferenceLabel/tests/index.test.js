import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import ReferenceLabel from '../index';

const annotation = {
    time: '2020-01-01',
    number: 'testNumber',
    tags: [],
    serviceName: 'testServiceName',
    id: '2020-01-02'
};

describe('ReferenceLabel component testing', () => {
    it('checks ReferenceLabel component exists', () => {
        const wrapper = shallow(
            <ReferenceLabel
                annotation={annotation}
            />
        );

        expect(wrapper).to.have.length(1);
    });
});
