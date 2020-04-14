import React from 'react';
import {shallow} from 'enzyme';
import NoResults from '../NoResults';


describe('<NoResults />', () => {
    it('renders successfully', () => {
        const wrapper = shallow(<NoResults />);
        expect(wrapper).toHaveLength(1);
    });
});
