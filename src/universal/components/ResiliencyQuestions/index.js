import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SearchableList from '@homeaway/react-searchable-list';
import InputNumber from '../InputNumber'
import InputText from '../InputText'
import {DatePicker} from '@homeaway/react-date-pickers';
import h from '../utils/formatString'
import moment from 'moment';
import DayTemplatePast from './DayTemplatePast';
import './styles.less';

class ResiliencyQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dates: {
                'Multi-Region-ETA': moment().format('YYYY-MM-DD'),
                'Resilient-ETA': moment().format('YYYY-MM-DD'),
                'Last-Rollback-Date': moment().format('YYYY-MM-DD'),
            },
            errorMsg: ''
        }
    }

    checkDatesError = () => {
        const {dates} = this.state;
        if (dates['Multi-Region-ETA'] > dates['Resilient-ETA']) {
            this.setState({errorMsg: 'Error: Resilient-ETA date must be later than Multi-Region-ETA'})
        } else {
            this.setState({errorMsg: ''})
        }
    }

    renderQuestionInput = (id,question) =>  (
        <InputText 
            key={id}
            id={id}
            question={question} 
        />
    )

    renderNumericQuestion = (id,question,type,values) =>  (
        <InputNumber
            key={id}
            id={id}
            question={question} 
            type={type} 
            range={values}
        />
    )

    renderDateQuestion = (id,question) =>  {
        let handleDateChange = this.handleDateChange
        let dayTemplateComponent = undefined
        let errorMsg = ''
        let onSubmit = undefined
        if(id==='Multi-Region-ETA') {
            handleDateChange = this.handleMultiRegionDate
            onSubmit = this.checkDatesError
        }
        else if (id==='Resilient-ETA') {
            handleDateChange = this.handleResilientDate
            errorMsg = this.state.errorMsg
            onSubmit = this.checkDatesError
        }
        else if (id==='Last-Rollback-Date') {
            handleDateChange = this.handleLastRollbackDate
            dayTemplateComponent = DayTemplatePast
        }

        return (
            <DatePicker
                key={id}
                date={this.state.dates[id]}
                onDateChange={handleDateChange}
                label={question}
                name={question}
                id={id}
                minDate={moment('2019-01-01').toDate()}
                dayTemplateComponent={dayTemplateComponent}
                errorMsg={errorMsg}
                onSubmit={onSubmit}
            />
    )}

    renderCategoryQuestion = (id,question,values) =>  (
        <SearchableList 
            key={id}
            labelKey={id}
            options={values}
            inputProps={{
                label: question,
                id: id
            }}
        />
    )

    handleMultiRegionDate = (event) => (this.setState({dates:{...this.state.dates, 'Multi-Region-ETA': event}}))

    handleResilientDate = (event) => (this.setState({dates:{...this.state.dates, 'Resilient-ETA': event}}))

    handleLastRollbackDate = (event) => (this.setState({dates:{...this.state.dates, 'Last-Rollback-Date': event}}))

    handleDateChange = (event) => (this.setState({dates:{date: event}}))

    render() {
        const {questions} = this.props;
        return (
            questions.map((q) => {
                const id = h.replaceSpaces(q.question)
                if(q.type === 'category') {
                    return this.renderCategoryQuestion(id,q.question,q.values)
                } else if (q.type === 'number' || q.type === 'integer') {
                    return this.renderNumericQuestion(id,q.question,q.type,q.values)
                } else if (q.type === 'date') {
                    return this.renderDateQuestion(id,q.question)
                } else {
                    return this.renderQuestionInput(id,q.question)
                }
            })
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