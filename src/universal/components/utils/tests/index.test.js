
import {expect} from 'chai';
import * as h from '../formatDate'

describe('formatDurationToHours', () => {

    it('returns the duration from milliseconds in HH:mm:ss format', async () => {
        expect(h.formatDurationToHours(5000000)).to.be.eql('01:23:20')
    })
})