import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import 'moment-timezone';
import moment from 'moment';
import AnnotationsFilterPanel from '../index';

const initialStart = moment().subtract(6, 'hours').startOf('minute');
const initialEnd = moment().endOf('minute');

describe('AnnotationsFilterPanel component testing', () => {
    it('checks AnnotationsFilterPanel component exists', () => {
        const wrapper = shallow(<AnnotationsFilterPanel
            enableAlerts
            setEnableAlerts={jest.fn()}
            selectedCategories={['test category']}
            setSelectedCategories={jest.fn()}
            selectedProducts={['test product']}
            setSelectedProducts={jest.fn()}
            selectedApplications={['test application']}
            setSelectedApplications={jest.fn()}
            start={initialStart}
            end={initialEnd}
        />);

        expect(wrapper).to.have.length(1);
    });
});
