import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '../LoadingContainer';
import {Divider} from '@homeaway/react-collapse';
import './styles.less';

class SavedQuestionnaire extends PureComponent {

    renderQuestionnaire= (questionnaire,idx) => {
        const id = questionnaire.timestamp || idx 
        return (
        <Divider heading={(id+1).toString()} id={id} key={id}>
            {
                questionnaire.map(q => 
                    <div classNames='questionDiv' key={q.key}>
                        <span className='question'>{q.key}</span>
                        <span className='answers'>{q.value}</span>
                    </div>)
            }
        </Divider>
    )}

    render() {
        const {
            isLoading,
            error,
            history,
        } = this.props;

        return (
            <LoadingContainer isLoading={isLoading} error={error}>
                {history.reverse().map((questionnaire,idx) => this.renderQuestionnaire(questionnaire,idx))}
            </LoadingContainer>
    )
    }
}

SavedQuestionnaire.defaultProps = {
    error: '',
    isLoading: null,
    history: [],
};

SavedQuestionnaire.propTypes = {
    error: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape()
    ]),
    isLoading: PropTypes.bool,
    history: PropTypes.array
};

export default SavedQuestionnaire;