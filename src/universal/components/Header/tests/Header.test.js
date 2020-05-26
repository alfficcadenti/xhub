import React from 'react';
import {shallow} from 'enzyme';
import Header from '../index';

describe('<Header />', () => {
    it('renders successfully', () => {
        shallow(<Header/>);
    });
});
