import {expect} from 'chai';
import {
    VRBO_BRAND,
    AB_TESTS_ANNOTATION_CATEGORY,
    DEPLOYMENT_ANNOTATION_CATEGORY,
    INCIDENT_ANNOTATION_CATEGORY
} from '../constants';
import {
    brandLogoFile,
    formatDuration,
    formatDurationForTable,
    formatDurationToH,
    getAnnotationStrokeColor
} from './utils';

describe('brandLogoFile', () => {
    it('returns null when given incorrect filename or when error occurs loading the file', async () => {
        // eslint-disable-next-line no-unused-expressions
        expect(brandLogoFile('nonsense')).to.be.null;
        // eslint-disable-next-line no-unused-expressions
        expect(brandLogoFile(VRBO_BRAND)).to.be.undefined;
    });
});

describe('formatDuration', () => {
    it('returns the duration in HH:mm:ss format', async () => {
        expect(formatDuration(61, 'minutes')).to.be.eql('1h 1m');
        expect(formatDuration(360000)).to.be.eql('6m');
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
    it('returns the duration from minutes in HH:mm:ss format', async () => {
        expect(formatDurationForTable(1501, 'minutes').toString().replace(/\s/g, '')).to.be.eql('<divvalue=1501>1d1h1m</div>');
    });
});

describe('getAnnotationStrokeColor', () => {
    it('returns correct color depending on annotation category', async () => {
        expect(getAnnotationStrokeColor(DEPLOYMENT_ANNOTATION_CATEGORY)).to.be.eql('red');
        expect(getAnnotationStrokeColor(INCIDENT_ANNOTATION_CATEGORY)).to.be.eql('green');
        expect(getAnnotationStrokeColor(AB_TESTS_ANNOTATION_CATEGORY)).to.be.eql('#255ABC');
        expect(getAnnotationStrokeColor()).to.be.eql('red');
    });
});
