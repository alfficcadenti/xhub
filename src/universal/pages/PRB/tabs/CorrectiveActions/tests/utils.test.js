import {expect} from 'chai';
import {
    getTableValue,
    mapDetails,
    checkIsRowSelected
} from '../utils';


describe('CorrectiveActions Utils', () => {
    it('getTableValue', () => {
        expect(getTableValue()).to.be.eql('-');
        expect(getTableValue(null, null)).to.be.eql('-');
        expect(getTableValue({a: 'hello'}, 'b')).to.be.eql('-');
        expect(getTableValue({a: 'hello'}, 'a')).to.be.eql('hello');
        expect(getTableValue({a: ''}, 'a')).to.be.eql('-');
    });

    it('mapDetails', () => {
        const row = {
            id: 'ID',
            assignee: 'assignee',
            projectName: 'Project',
            summary: 'Summary',
            status: 'Status',
            priority: 'Priority',
            department: 'Department',
            createdDate: '12-12-2020',
            resolvedDate: '12-13-2020',
            updatedDateTime: '12-14-2020',
            l1: 'L1',
            l2: 'L2',
            l3: 'L3',
            l4: 'L4',
            l5: 'L5'
        };
        const {
            Assignee, Project, Summary, Status, Priority, Department, Created, Resolved, Updated, L1, L2, L3, L4, L5
        } = mapDetails(row);
        expect(Assignee).to.be.eql(row.assignee);
        expect(Project).to.be.eql(row.projectName);
        expect(Summary).to.be.eql(row.summary);
        expect(Status).to.be.eql(row.status);
        expect(Priority).to.be.eql(row.priority);
        expect(Department).to.be.eql(row.department);
        expect(Created).to.be.eql(row.createdDate);
        expect(Resolved).to.be.eql(row.resolvedDate);
        expect(Updated).to.be.eql(row.updatedDateTime);
        expect(L1).to.be.eql(row.l1);
        expect(L2).to.be.eql(row.l2);
        expect(L3).to.be.eql(row.l3);
        expect(L4).to.be.eql(row.l4);
        expect(L5).to.be.eql(row.l5);
    });


    it('checkIsRowSelected', () => {
        expect(checkIsRowSelected('l1', {name: 'hello'}, null, null, null, 'hello')).to.be.eql(true);
        expect(checkIsRowSelected('l1', {name: 'hello'}, null, null, null, 'wrong')).to.be.eql(false);
        expect(checkIsRowSelected('l1', null, null, null, null, 'hello')).to.be.eql(false);
        expect(checkIsRowSelected('l2', {name: 'hello'}, {name: 'goodbye'}, null, null, 'goodbye')).to.be.eql(true);
        expect(checkIsRowSelected('l2', null, {name: 'goodbye'}, null, null, 'goodbye')).to.be.eql(false);
        expect(checkIsRowSelected('l2', {name: 'hello'}, null, null, null, 'wrong')).to.be.eql(false);
        expect(checkIsRowSelected('l2', null, null, null, null, 'hello')).to.be.eql(false);
        expect(checkIsRowSelected('l3', {name: 'hello'}, {name: 'goodbye'}, {name: 'goodbye'}, null, 'goodbye')).to.be.eql(true);
        expect(checkIsRowSelected('l3', null, {name: 'goodbye'}, {name: 'goodbye'}, null, 'goodbye')).to.be.eql(true);
        expect(checkIsRowSelected('l3', {name: 'hello'}, null, null, null, 'wrong')).to.be.eql(false);
        expect(checkIsRowSelected('l3', null, null, null, null, 'hello')).to.be.eql(false);
    });
});
