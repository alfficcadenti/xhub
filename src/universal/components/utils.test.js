import {expect} from 'chai';
import {
    AB_TESTS_ANNOTATION_CATEGORY,
    DEPLOYMENT_ANNOTATION_CATEGORY,
    INCIDENT_ANNOTATION_CATEGORY
} from '../constants';
import {formatDurationForTable, formatDurationToH, formatDurationToHours, getStrokeColor} from './utils';

describe('formatDurationToHours', () => {
    it('returns the duration from milliseconds in HH:mm:ss format', async () => {
        expect(formatDurationToHours(5000000)).to.be.eql('1h 23m ');
    });
});

describe('formatDurationToH', () => {
    it('returns the duration from milliseconds in HH:mm:ss format', async () => {
        expect(formatDurationToH(5000000)).to.be.eql('1.39');
    });
});

describe('formatDurationForTable', () => {
    it('returns the duration from milliseconds in HH:mm:ss format', async () => {
        expect(formatDurationForTable(5000000).toString().replace(/\s/g, '')).to.be.eql('<divvalue=5000000>1h23m</div>');
    });
});

describe('getStrokeColor', () => {
    it('returns correct color depending on annotation category', async () => {
        expect(getStrokeColor(DEPLOYMENT_ANNOTATION_CATEGORY)).to.be.eql('red');
        expect(getStrokeColor(INCIDENT_ANNOTATION_CATEGORY)).to.be.eql('green');
        expect(getStrokeColor(AB_TESTS_ANNOTATION_CATEGORY)).to.be.eql('#255ABC');
        expect(getStrokeColor()).to.be.eql('red');
    });
});
