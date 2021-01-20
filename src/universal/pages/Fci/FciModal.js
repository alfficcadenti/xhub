import React, {useState, useEffect} from 'react';
import moment from 'moment';
import Cookies from 'js-cookie';
import {Checkbox, FormTextArea} from '@homeaway/react-form-components';
import Modal from '@homeaway/react-modal';
import {SVGIcon} from '@homeaway/react-svg';
import {NEW_WINDOW__16} from '@homeaway/svg-defs';
import DataTable from '../../components/DataTable';
import HelpText from '../../components/HelpText/HelpText';
import LoadingContainer from '../../components/LoadingContainer';
import {OPXHUB_SUPPORT_CHANNEL} from '../../constants';
import {checkResponse} from '../utils';
import {getFilteredTraceData, mapComment} from './utils';
import {FCI_DETAIL_COLUMNS, COMMENT_TABLE_COLUMNS, TRACE_TABLE_COLUMNS} from './constants';

const FciModal = ({data, isOpen, onClose}) => {
    const {
        traceId,
        recordedSessionUrl,
        details,
        editMode
    } = data;
    const title = editMode
        ? 'Edit Details'
        : `Trace Log (ID=${traceId})`;
    const [filteredData, setFilteredData] = useState([]);
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [comment, setComment] = useState('');
    const [isFci, setIsFci] = useState(true);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        if (!editMode) {
            setFilteredData(getFilteredTraceData(data.tableData));
        } else {
            setIsLoading(true);
            setError();
            fetch(`/getComments?traceId=${traceId}`)
                .then(checkResponse)
                .then((response) => {
                    const mappedComments = (response || [])
                        .map(mapComment)
                        .sort((a, b) => moment(a.Created).isAfter(b.Created));
                    setComments(mappedComments);
                    if (mappedComments.length) {
                        const lastComment = mappedComments[0];
                        setComment(lastComment.Comment);
                        setIsFci(lastComment['Is FCI'] === 'true');
                    }
                })
                .catch((err) => {
                    setError('Failed to retrieve comment data. Try refreshing the page. '
                        + `If the problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`);
                    // eslint-disable-next-line no-console
                    console.error(err);
                })
                .finally(() => setIsLoading(false));
        }
    }, [traceId, data, editMode]);

    const handleCommentChange = (event) => {
        if (event && event.target) {
            setComment(event.target.value);
            setIsDirtyForm(true);
        }
    };

    const handleIsFciChange = (event) => {
        if (event && event.target) {
            setIsFci(event.target.checked);
            setIsDirtyForm(true);
        }
    };

    const handleSave = () => {
        const timestamp = moment().toISOString();
        const author = Cookies.get('email') || 'anonymous';
        fetch('/addComment', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain; charset=UTF-8',
            },
            body: `{
                "traceId": "${traceId}",
                "timestamp": "${timestamp}",
                "author": "${author}",
                "comment": "${comment}",
                "isFci": ${isFci}
            }`
        });
        const nextComments = JSON.parse(JSON.stringify(comments));
        nextComments.unshift({
            Created: timestamp,
            Author: author,
            Comment: comment,
            'Is FCI': isFci
        });
        setComments(nextComments);
        setIsDirtyForm(false);
    };

    const renderRow = (label, value) => (
        <div className="detail-row" key={label}>
            <div className="detail-label">{label}</div>
            <div className="detail-value">{value}</div>
        </div>
    );

    const renderDetails = () => (
        <div className="details-container">
            <div className="details-table">
                {FCI_DETAIL_COLUMNS
                    .map((column) => renderRow(column, details[column]))}
                <div className="detail-row">
                    <div className="detail-label">{'Comment'}</div>
                    <div className="detail-value">
                        <FormTextArea
                            id="comment"
                            label="comment"
                            className="comment-input"
                            value={comment}
                            onChange={handleCommentChange}
                        />
                    </div>
                </div>
                <div className="detail-row">
                    <div className="detail-label">{'Is FCI'}</div>
                    <div className="detail-value">
                        <Checkbox
                            name="isFci"
                            checked={isFci}
                            onChange={handleIsFciChange}
                        />
                    </div>
                </div>
                <div
                    className="btn btn-primary save-btn"
                    type="button"
                    onClick={handleSave}
                    onKeyUp={(e) => e.key === 'Enter' && handleSave()}
                    role="button"
                    index={0}
                    disabled={!isDirtyForm}
                >
                    {'Save'}
                </div>
            </div>
            <LoadingContainer isLoading={isLoading} error={error} className="comments-container">
                <DataTable
                    title={'History'}
                    data={comments}
                    columns={COMMENT_TABLE_COLUMNS}
                    paginated
                />
            </LoadingContainer>
        </div>
    );

    const renderTraceLog = () => (
        <div className="log-container">
            <a target="_blank" rel="noopener noreferrer" className="ext-link" href={`https://bex.haystack.exp-prod.net/search?query_1.traceId=${traceId}`}>
                {'Haystack'} <SVGIcon usefill markup={NEW_WINDOW__16} />
            </a>
            <a target="_blank" rel="noopener noreferrer" className="ext-link" href={recordedSessionUrl}>
                {'Glassbox'} <SVGIcon usefill markup={NEW_WINDOW__16} />
            </a>
            <HelpText className="help-text" text={'Not all sessions are recorded'} placement="bottom" />
            <DataTable
                title={'Error Traces'}
                info={'See Haystack for full error log.'}
                data={filteredData}
                columns={TRACE_TABLE_COLUMNS}
                rules={[{column: 'Error', setClass: (val) => val === 'true' ? 'error-cell' : 'success-cell'}]}
                paginated
            />
        </div>
    );

    const handleOnClose = () => {
        setComment();
        setIsFci(true);
        onClose();
    };

    return (
        <Modal
            title={title}
            id="fci-modal"
            className="fci-modal"
            isOpen={isOpen}
            onClose={handleOnClose}
        >
            {editMode ? renderDetails() : renderTraceLog()}
        </Modal>
    );
};

export default FciModal;