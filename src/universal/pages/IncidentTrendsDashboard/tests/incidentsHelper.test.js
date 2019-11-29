import {expect} from 'chai';
import incidentsHelper from '../incidentsHelper';
import mockData from './filteredData.test.json';

const dataResult = {
        "Brand": "Expedia Partner Solutions (EPS)",
        "Duration": "00:00:17",
        "Incident": "INC4419505",
        "Priority": "1-Critical",
        "Root Cause Owners": "EAN Release - Deploy",
        "Status": "Closed",
        "Summary": "EAN Degraded",
};

describe('incidentsHelper', () => {
    it('returns empty array if filteredIncidents is not passed', () => {
        const result = incidentsHelper.getIncidentsData();
        expect(result).to.be.eql([]);
    });

    it('returns array populated if filteredIncidents are passed', () => {
        const result = incidentsHelper.getIncidentsData([mockData[0]]);
        expect(result[0].Brand).to.be.eql(dataResult.Brand);
        expect(result[0].Duration).to.be.eql(dataResult.Duration);
        expect(result[0].Incident).to.be.eql(dataResult.Incident);        
        expect(result[0].Priority).to.be.eql(dataResult.Priority);
        expect(result[0].Status).to.be.eql(dataResult.Status);
        expect(result[0].Summary).to.be.eql(dataResult.Summary);
        expect(result[0]["Root Cause Owners"]).to.be.eql(dataResult["Root Cause Owners"]);
    })

    it('returns empty string when values are null', () => {
        const result = incidentsHelper.getIncidentsData([mockData[1]]);
        expect(result[0]["Root Cause Owners"]).to.be.eql('');
        expect(result[0].Summary).to.be.eql('');
        expect(result[0].Duration).to.be.eql('');
        expect(result[0].Status).to.be.eql('');
        expect(result[0].Priority).to.be.eql('');
    })
});
