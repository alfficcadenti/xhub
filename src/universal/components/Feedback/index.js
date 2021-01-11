/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {useState} from 'react';
import {FormTextArea, FormInput} from '@homeaway/react-form-components';
import FilterDropDown from '../../components/FilterDropDown';
import {Button} from '@homeaway/react-buttons';
import Modal from '@homeaway/react-modal';
import {SVGIcon} from '@homeaway/react-svg';
import {THUMB__24, THUMB_SELECTED__24} from '@homeaway/svg-defs';
import Cookies from 'js-cookie';
import './styles.less';


const commentTypes = [
    'Suggestion',
    'Technical Issue'
];
const useOktaEmail = Cookies.get('email');


const Feedback = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [thumbsUp, setThumbsUp] = useState(true);
    const [thumbsDown, setThumbsDown] = useState(false);
    const [feedbackComment, setFeedbackComment] = useState('');
    const [commentType, setCommentType] = useState(commentTypes[0]);
    const [email, setEmail] = useState(useOktaEmail);

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
        setThumbsUp(true);
        setThumbsDown(false);
        setFeedbackComment('');
        setCommentType(commentTypes[0]);
        setEmail('');
    };

    const handleOpen = () => setIsModalOpen(true);

    const handleClose = () => setIsModalOpen(false);

    const handleSendFeedback = () => {
        const slackWebhookUrl = 'https://hooks.slack.com/services/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';

        const sendFeedback = () => {
            fetch(slackWebhookUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'text/plain; charset=UTF-8',
                },
                body: `{
                "channel": "#opxhub-feedback",
                "text": "Overall Experience: ${thumbsUp ? 'positive' : 'negative'}; Comment Type: ${commentType}; Feedback: ${feedbackComment}; Url: ${window.location.href}; Email: ${email}"
            }`
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error();
                }
            }).catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
        };

        sendFeedback();

        clearForm();
        handleClose();
    };

    return (
        <div className="feedback-container">
            <button onClick={handleOpen} className="feedback-button">{'Feedback'}</button>
            <Modal
                id="feedback-modal"
                isOpen={isModalOpen}
                onClose={handleClose}
                title="Please tell us what do you think of our website"
            >
                <form>
                    <div className="page-ratings">
                        <hr/>
                        <div className="ratings-wrapper">
                            <span className="ratings-label">{'Page rating'}</span>
                            <div className="thumbs-wrapper thumbs-up" tabIndex={0} role="button" onClick={() => {
                                setThumbsUp(true);
                                setThumbsDown(false);
                            }}
                            >
                                <SVGIcon markup={thumbsUp ? THUMB_SELECTED__24 : THUMB__24} />
                            </div>
                            <div className="thumbs-wrapper thumbs-down" tabIndex={0} role="button" onClick={() => {
                                setThumbsUp(false);
                                setThumbsDown(true);
                            }}
                            >
                                <SVGIcon markup={thumbsDown ? THUMB_SELECTED__24 : THUMB__24} />
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
                        <Button label="Submit" className="submit-feedback" onClick={handleSendFeedback} />
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Feedback;
