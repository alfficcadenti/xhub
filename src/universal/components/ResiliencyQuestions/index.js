import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '../LoadingContainer';
import {FormTextArea} from '@homeaway/react-form-components';

class ResiliencyQuestions extends PureComponent {

    renderQuestionInput = (id,question) => {return (
        <FormTextArea 
            key={id}
            id={id.toString()}
            label={question}
            autoExpand
            maxHeight="15em"
        />
    )}

    render() {
        const {
            isLoading,
            error,
            questions,
        } = this.props;

        return (
            <LoadingContainer isLoading={isLoading} error={error}>
                {questions.map((q) => this.renderQuestionInput(q.question,q.question))}
            </LoadingContainer>
    )
    }
}

ResiliencyQuestions.defaultProps = {
    error: '',
    isLoading: null,
    questions: [],
};

ResiliencyQuestions.propTypes = {
    error: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape()
    ]),
    isLoading: PropTypes.bool,
    questions: PropTypes.array,
};

export default ResiliencyQuestions;