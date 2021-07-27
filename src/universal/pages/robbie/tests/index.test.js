import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import DataTable from '../../../components/DataTable';

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useHistory: () => ({
            push: jest.fn(),
        }),
        useLocation: () => ({
            pathname: '/test',
            hash: '',
            search: '',
            state: ''
        })
    };
});

global.fetch = require('node-fetch');

describe('<DataTable>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <DataTable
                title="Robbie Notification Service"
                data = {[]}
                columns = {[]}
                columnsInfo = {[]}
            />
        );
    });

    it('renders successfully', () => {
        expect(wrapper).to.have.length(1);
    });
});

