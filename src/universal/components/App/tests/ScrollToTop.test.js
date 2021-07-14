import React from 'react';
import {mount} from 'enzyme/build';
import ScrollToTop from '../ScrollToTop.js';
import App from '../App';

import {MemoryRouter as Router} from 'react-router-dom';
global.scrollTo = jest.fn();

describe('<ScrollToTop />', () => {
    let wrapper;
    let history;

    beforeEach(() => {
        wrapper = mount(
            <Router initialEntries={['/']}>
                <ScrollToTop>
                    <App/>
                </ScrollToTop>
            </Router>
        );
        history = wrapper.instance().history;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders successfully', () => {
        expect(wrapper.find('.header')).toHaveLength(1);
    });

    it('it renders children', () => {
        const component = wrapper.find(ScrollToTop);
        expect(component.children().length).toEqual(1);
        expect(component.contains(<App />)).toEqual(true);
    });

    it('calls window.scrollTo when route changes', () => {
        expect(global.scrollTo).not.toHaveBeenCalled();
        history.push('/new-url');
        expect(global.scrollTo).toHaveBeenCalledWith(0, 0);
    });
});
