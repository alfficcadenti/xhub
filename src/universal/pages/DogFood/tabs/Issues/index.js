import React from 'react';
import DataTable from '../../../../components/DataTable';
import {TABLE_COLUMNS, HIDDEN_TABLE_COLUMNS} from '../../constants';

const Issues = ({issues}) => (
    <div className="dog-food-issues">
        <DataTable
            title={`Dog Food (${issues.length} issues)`}
            data={issues}
            columns={TABLE_COLUMNS}
            hiddenColumns={HIDDEN_TABLE_COLUMNS}
            paginated
            enableColumnDisplaySettings
            enableTextSearch
            isSorting
        />
    </div>
);

export default Issues;