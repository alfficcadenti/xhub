import React, {useState} from 'react';
import {FormTextArea, FormInput} from '@homeaway/react-form-components';
import FilterDropDown from '../../components/FilterDropDown';
import {Button} from '@homeaway/react-buttons';
import Modal from '@homeaway/react-modal';
import {SVGIcon} from '@homeaway/react-svg';
import {THUMB__24, THUMB_SELECTED__24} from '@homeaway/svg-defs';
import './styles.less';


const commentTypes = [
    'Suggestion',
    'Technical Issue'
];
const THUMBS_UP = 'thumbs-up';
const THUMBS_DOWN = 'thumbs-down';
const defaultOverallExperience = {[THUMBS_UP]: true};


const FeedbackModal = ({isOpen, handleClose}) => {
    const [overallExperience, setOverallExperience] = useState(defaultOverallExperience);
    const [feedbackComment, setFeedbackComment] = useState('');
    const [commentType, setCommentType] = useState(commentTypes[0]);
    const [email, setEmail] = useState('');

    const handleFeedbackTextChange = (event) => {
        setFeedbackComment(event.target.value);
    };

    const handleCommentTypeChange = (event) => {
        setCommentType(event);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const clearForm = () => {
        setOverallExperience(defaultOverallExperience);
        setFeedbackComment('');
        setCommentType(commentTypes[0]);
        setEmail('');
    };

    const sendFeedback = () => {
        // TODO: replace with a POST request to slack (once webhook url is ready: ask Ranjith)
        console.log('overallExperience: ', overallExperience);
        console.log('commentSection: ', commentType);
        console.log('feedbackComment: ', feedbackComment);
        console.log('email: ', email);
        clearForm();
    };

    const handleRatingChange = (event) => {
        const newOverallExperience = {};

        if (event === THUMBS_UP && !overallExperience[THUMBS_UP]) {
            newOverallExperience[THUMBS_UP] = true;
            newOverallExperience[THUMBS_DOWN] = false;
        } else if (event === THUMBS_DOWN && !overallExperience[THUMBS_DOWN]) {
            newOverallExperience[THUMBS_DOWN] = true;
            newOverallExperience[THUMBS_UP] = false;
        } else {
            newOverallExperience[THUMBS_UP] = overallExperience[THUMBS_UP];
            newOverallExperience[THUMBS_DOWN] = overallExperience[THUMBS_DOWN];
        }

        setOverallExperience(newOverallExperience);
    };

    return (
        <Modal
            id="feedback-modal"
            isOpen={isOpen}
            onClose={handleClose}
            title="Please tell us what do you think of our website"
        >
            <form action="" className="feedback-wrapper">
                <div className="page-ratings">
                    <hr/>
                    <div className="ratings-wrapper">
                        <span className="ratings-label">{'Page rating'}</span>
                        <div className="thumbs-wrapper thumbs-up" onClick={() => handleRatingChange(THUMBS_UP)}>
                            <SVGIcon markup={overallExperience[THUMBS_UP] ? THUMB_SELECTED__24 : THUMB__24} />
                        </div>
                        <div className="thumbs-wrapper thumbs-down" onClick={() => handleRatingChange(THUMBS_DOWN)}>
                            <SVGIcon markup={overallExperience[THUMBS_DOWN] ? THUMB_SELECTED__24 : THUMB__24} />
                        </div>
                    </div>
                    <hr/>
                </div>
                <div className="page-comments-wrapper">
                    <div className="comment-type-wrapper">
                        <span className="comment-type-label">{'Comment type:'}</span>
                        <FilterDropDown
                            id="comment-type-dropdown"
                            list={commentTypes}
                            selectedValue={commentType}
                            onClickHandler={handleCommentTypeChange}
                        />
                    </div>
                    <FormTextArea
                        id="feedback"
                        label="Enter your comments here"
                        rows={4}
                        onChange={handleFeedbackTextChange}
                        value={feedbackComment}
                    />
                </div>
                <hr/>
                <div className="email-section">
                    <FormInput
                        id="email-input"
                        name="emailInput"
                        label="Please enter  your email address (optional)"
                        onChange={handleEmailChange}
                        value={email}
                    />
                </div>
                <div className="footer-section">
                    <Button label="send feedback" onClick={sendFeedback} />
                </div>
            </form>
        </Modal>
    );
};

export default FeedbackModal;
