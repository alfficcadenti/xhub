import {expect} from 'chai';
import {DEFAULT_PAGE_INFO, IMPULSE_PAGE_INFO, getPageInfo} from '../info';

describe('Help/info', () => {
    it('Fetches default page info', () => {
        expect(getPageInfo('/')).to.have.equal(DEFAULT_PAGE_INFO);
    });

    it('Fetches impulse info', () => {
        expect(getPageInfo('/impulse')).to.have.equal(IMPULSE_PAGE_INFO);
    });
});
