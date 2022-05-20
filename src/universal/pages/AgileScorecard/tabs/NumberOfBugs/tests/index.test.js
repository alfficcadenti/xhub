import React from 'react';
import {render, act} from '@testing-library/react';
import BugsModal from '../BugsModal';
import NumberOfBugs from '../index';
import {MOCK_BUG_LIST, MOCK_NUMBER_OF_BUGS, MOCK_TEAMS} from '../../../tests/mockData';
import '@testing-library/jest-dom';


describe('<NumberOfBugs />', () => {
    global.scrollTo = jest.fn();

    let wrapper = '';
    beforeEach(() => {
        fetch.resetMocks();
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders Error message when api return error', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: false,
                json: () => Promise.resolve([])
            });
        });
        await act(async () => {
            wrapper = render(<NumberOfBugs teams={MOCK_TEAMS} from="2021-11-21" to="2021-11-22" />);
        });
        expect(wrapper.getByText(/Error loading the Number of Bugs/)).toBeInTheDocument();
        expect(wrapper.getByRole('alert')).toBeInTheDocument();
        expect(wrapper).toMatchSnapshot();
    });

    it('renders chart when api return mocked data', async () => {
        fetch.mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(MOCK_NUMBER_OF_BUGS)
            });
        });
        await act(async () => {
            wrapper = render(<NumberOfBugs teams={MOCK_TEAMS} from="2021-11-21" to="2021-11-22" />);
        });
        expect(wrapper).toMatchSnapshot();
    });
});

describe('<BugsModal />', () => {
    it('renders successfully', () => {
        const wrapper = render(<BugsModal dataObj={MOCK_BUG_LIST} onClose={() => {}} />);
        expect(wrapper.getByText('open bugs (2 Results)')).toBeInTheDocument();
        expect(wrapper.getByText('closed bugs (1 Result)')).toBeInTheDocument();
        expect(wrapper).toMatchSnapshot();
    });
});
