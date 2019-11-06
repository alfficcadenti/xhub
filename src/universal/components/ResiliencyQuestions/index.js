import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {FormTextArea} from '@homeaway/react-form-components';

class ResiliencyQuestions extends PureComponent {

    renderQuestionInput = (id,question) =>  (
        <FormTextArea 
            key={id}
            id={id.toString()}
            label={question}
            autoExpand
            maxHeight="15em"
            className='resiliency-question'
        />
    )

    render() {
        const {questions} = this.props;

        return (
            questions.map((q) => this.renderQuestionInput(q.question,q.question))
        )
    }
}

ResiliencyQuestions.defaultProps = {
    questions: [],
};

ResiliencyQuestions.propTypes = {
    questions: PropTypes.array,
};

export default ResiliencyQuestions;