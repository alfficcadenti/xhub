import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '../LoadingContainer';
import {Divider} from '@homeaway/react-collapse';
import './styles.less';

class SavedQuestionnaire extends PureComponent {
    lastQuestionnaireHeader = () => (
        <div className="questionDiv header">
            <span className="question">{'Questions'}</span>
            <span className="answers old-answers">{'Previous'}</span>
            <span className="answers">{'Latest'}</span>
        </div>
    )

    questionnaireHeader = () => (
        <div className="questionDiv header">
            <span className="question">{'Questions'}</span>
            <span className="answers">{'Answers'}</span>
        </div>
    )

    formatRegionsAnswer = (regions) => {
        try {
            const regionsObj = JSON.parse(regions);
            return Object.keys(regionsObj).filter((k) => regionsObj[k]).join(', ');
        } catch (e) {
            return regions;
        }
    }

    lastQuestionnaire= (last, previous) => {
        const username = last.questionnaire.username || 'by unknown';
        const id = last.timestamp.concat(' ', username) || 1;
        return (
            <Divider heading={(id).toString()} id={id} key={id}>
                {this.lastQuestionnaireHeader()}
                {
                    last.questionnaire.questions.map((q, idx) => {
                        const lastValueClass = q.value !== previous.questionnaire.questions[idx].value ? 'answers new-value' : 'answers';
                        return (
                            <div className="questionDiv" key={q.key}>
                                <span className="question">{q.key}</span>
                                <span className="answers old-answers">{q.key === 'Deployed in Regions' ? this.formatRegionsAnswer(previous.questionnaire.questions[idx].value) : previous.questionnaire.questions[idx].value}</span>
                                <span className={lastValueClass}>{q.key === 'Deployed in Regions' ? this.formatRegionsAnswer(q.value) : q.value}</span>
                            </div>
                        );
                    }
                    )
                }
            </Divider>
        );
    }

    renderQuestionnaire= (questionnaire, idx) => {
        const username = questionnaire.questionnaire.username || 'by unknown';
        const id = questionnaire.timestamp.concat(' ', username) || idx + 1;
        return (
            <Divider heading={(id).toString()} id={id} key={id}>
                {this.questionnaireHeader()}
                {
                    questionnaire.questionnaire.questions.map((q) =>
                        (<div className="questionDiv" key={q.key}>
                            <span className="question">{q.key}</span>
                            <span className="answers">{q.key === 'Deployed in Regions' ? this.formatRegionsAnswer(q.value) : q.value}</span>
                        </div>))
                }
            </Divider>
        );
    }

    render() {
        const {
            isLoading,
            error,
            history,
        } = this.props;

        if (history.length > 2) {
            return (
                <LoadingContainer isLoading={isLoading} error={error}>
                    {this.lastQuestionnaire(history[0], history[1])}
                    {history.slice(1).map((questionnaire, idx) => this.renderQuestionnaire(questionnaire, idx))}
                </LoadingContainer>
            );
        }
        return (
            <LoadingContainer isLoading={isLoading} error={error}>
                {history.map((questionnaire, idx) => this.renderQuestionnaire(questionnaire, idx))}
            </LoadingContainer>
        );
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
    history: PropTypes.arrayOf(PropTypes.shape())
};

export default SavedQuestionnaire;