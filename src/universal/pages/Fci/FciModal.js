import React, {useState, useEffect} from 'react';
import moment from 'moment';
import Cookies from 'js-cookie';
import {Checkbox, FormTextArea} from '@homeaway/react-form-components';
import Modal from '@homeaway/react-modal';
import {SVGIcon} from '@homeaway/react-svg';
import {NEW_WINDOW__16, LINK__16} from '@homeaway/svg-defs';
import DataTable from '../../components/DataTable';
import HelpText from '../../components/HelpText/HelpText';
import LoadingContainer from '../../components/LoadingContainer';
import {OPXHUB_SUPPORT_CHANNEL} from '../../constants';
import {checkResponse} from '../utils';
import {mapComment} from './utils';
import {FCI_DETAIL_COLUMNS, COMMENT_TABLE_COLUMNS, TRACE_TABLE_COLUMNS, FCI_TABLE_COLUMNS, FCI_HIDDEN_TABLE_COLUMNS} from './constants';


const FciModal = ({fci, fcis, editMode, isOpen, onClose, onSaveComment, onEditBack, isLoading, error}) => {
    const [isDirtyForm, setIsDirtyForm] = useState(false);
    const [comment, setComment] = useState('');
    const [isFci, setIsFci] = useState(true);
    const [comments, setComments] = useState([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [commentsError, setCommentsError] = useState();

    useEffect(() => {
        if (editMode && fci) {
            setIsLoadingComments(true);
            setCommentsError();
            fetch(`/getComments?traceId=${fci.Trace}`)
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
                    setCommentsError('Failed to retrieve comment data. Try refreshing the page. '
                        + `If the problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`);
                    // eslint-disable-next-line no-console
                    console.error(err);
                })
                .finally(() => setIsLoadingComments(false));
        }
    }, [editMode, fci]);

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
        const traceId = fci ? fci.Trace : '-';
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
        onSaveComment(traceId, comment, isFci);
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

    const renderTraceLog = () => (
        <div className="log-container">
            <a target="_blank" rel="noopener noreferrer" className="ext-link" href={`https://bex.haystack.exp-prod.net/search?query_1.traceId=${fci ? fci.Trace : '-'}`}>
                {'Haystack'} <SVGIcon usefill markup={NEW_WINDOW__16} />
            </a>
            <a target="_blank" rel="noopener noreferrer" className="ext-link" href={fci.recordedSessionUrl}>
                {'Glassbox'} <SVGIcon usefill markup={NEW_WINDOW__16} />
            </a>
            <HelpText className="help-text" text={'Not all sessions are recorded'} placement="bottom" />
            <button className="modal-link copy-link" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                {'Copy Link'} <SVGIcon usefill markup={LINK__16} />
            </button>
            <DataTable
                title={'Error Traces'}
                info={'See Haystack for full error log.'}
                data={fci.traces}
                columns={TRACE_TABLE_COLUMNS}
                rules={[{column: 'Error', setClass: (val) => val === 'true' ? 'error-cell' : 'success-cell'}]}
                paginated
            />
        </div>
    );

    const renderBackButton = () => (
        <div
            className="modal-link back-btn"
            onClick={onEditBack}
            onKeyUp={(e) => e.key === 'Enter' && onEditBack()}
            role="button"
            tabIndex={0}
        >
            {'Back'}
        </div>
    );

    const renderDetails = () => (
        <div className="details-container">
            {fcis && fcis.length ? renderBackButton() : null}
            <h3>{`FCI Details (traceId="${fci.Trace}")`}</h3>
            <div className="details-table">
                {FCI_DETAIL_COLUMNS
                    .map((column) => renderRow(column, fci[column]))}
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
            {renderTraceLog()}
            <LoadingContainer isLoading={isLoadingComments} error={commentsError} className="comments-container">
                <DataTable
                    title={'History'}
                    data={comments}
                    columns={COMMENT_TABLE_COLUMNS}
                    paginated
                />
            </LoadingContainer>
        </div>
    );

    const renderFciTable = () => (
        <div className="log-container">
            <DataTable
                title={`FCIs (${fcis.length} results)`}
                data={fcis}
                columns={FCI_TABLE_COLUMNS}
                hiddenColumns={FCI_HIDDEN_TABLE_COLUMNS}
                paginated
                enableColumnDisplaySettings
                enableTextSearch
            />
        </div>
    );

    const handleOnClose = () => {
        setComment();
        setIsFci(true);
        onEditBack();
        onClose();
    };

    return (
        <Modal
            id="fci-modal"
            className="fci-modal"
            isOpen={isOpen}
            onClose={handleOnClose}
        >
            <LoadingContainer isLoading={isLoading} error={error}>
                {editMode ? renderDetails() : renderFciTable()}
            </LoadingContainer>
        </Modal>
    );
};

export default FciModal;
