import React from 'react';
import {shallow} from 'enzyme';
import FeedbackModal from '../index';

global.fetch = require('node-fetch');

describe('FeedbackModal component testing', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<FeedbackModal onClose={() => {}} />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('checks FeedbackModal component exists', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('check fetch params', (done) => {
        const mockSuccessResponse = {};
        const mockJsonPromise = Promise.resolve(mockSuccessResponse);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
        });

        jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

        wrapper.find('.submit-feedback').simulate('click');

        expect(global.fetch).toHaveBeenCalledTimes(1);

        const url = 'https://hooks.slack.com/services/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';
        const body = {
            'body': `{
                "channel": "#opxhub-feedback",
                "text": "Overall Experience: positive; Comment Type: Suggestion; Feedback: ; Url: ${window.location.href}; Email: undefined"
            }`,
            'headers': {
                'Accept': 'application/json',
                'Content-Type': 'text/plain; charset=UTF-8'
            },
            'method': 'POST'
        };

        expect(global.fetch).toHaveBeenCalledWith(
            url,
            body
        );

        process.nextTick(() => {
            global.fetch.mockClear();
            done();
        });
    });
});
