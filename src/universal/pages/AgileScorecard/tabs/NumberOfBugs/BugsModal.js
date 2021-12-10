import React from 'react';
import Modal from '@homeaway/react-modal';
import {listOfBugs} from '../../utils';
import {BUGS_TYPE_KEYS} from '../../constants';
import DataTable from '../../../../components/DataTable';
import './styles.less';

const singleId = (id) => ({
    ID: (
        <div key={id + Math.random()} className="tooltip-bug-div">
            <a href={`https://jira.expedia.biz/browse/${id}`} target="_blank">{id}</a>
        </div>
    )
});

const renderBugList = (bugsList, bugType) => (
    <div className="bug-list-table" key={`bug-list-${bugType}`}>
        <DataTable
            title={`${bugType} (${listOfBugs(bugsList, bugType)?.length} Result(s))`}
            data={listOfBugs(bugsList, bugType)?.map(singleId) || []}
            columns={['ID']}
            pageSize={10}
            paginated
        />
    </div>
);

const BugsModal = ({dataObj = {}, onClose}) => (
    <Modal
        id="bugs-modal"
        className="bugs-modal"
        isOpen={!!Object.keys(dataObj).length}
        onClose={onClose}
    >
        {Object.keys(dataObj).length && BUGS_TYPE_KEYS.map((type) => renderBugList(dataObj, type))}
    </Modal>
);

export default BugsModal;