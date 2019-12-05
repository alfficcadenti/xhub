
import {expect} from 'chai';
import * as h from '../formatDate'

describe('formatDurationToHours', () => {

    it('returns the duration from milliseconds in HH:mm:ss format', async () => {
        expect(h.formatDurationToHours(5000000)).to.be.eql('1h 23m ')
    })
})

describe('formatDurationToH', () => {

    it('returns the duration from milliseconds in HH:mm:ss format', async () => {
        expect(h.formatDurationToH(5000000)).to.be.eql('1.39')
    })
})

describe('formatDurationForTable', () => {

    it('returns the duration from milliseconds in HH:mm:ss format', async () => {
        expect(h.formatDurationForTable(5000000)).to.be.eql("<a name='83.33333333333333'></a>an hour")
    })
})