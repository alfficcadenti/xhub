import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SearchableList from '@homeaway/react-searchable-list';
import InputNumber from '../InputNumber';
import InputText from '../InputText';
import {DatePicker} from '@homeaway/react-date-pickers';
import {Checkbox} from '@homeaway/react-form-components';
import h from '../utils/formatString';
import moment from 'moment';
import DayTemplatePast from './DayTemplatePast';
import Tooltip from '@homeaway/react-tooltip';
import './styles.less';

class ResiliencyQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dates: {
                'Multi-Region-ETA': '',
                'Resilient-ETA': '',
                'Last-Rollback-Date': '',
            },
            errorMsg: ''
        };
    }

    checkDatesError = () => {
        const {dates} = this.state;
        if (dates['Multi-Region-ETA'] > dates['Resilient-ETA']) {
            this.setState({errorMsg: 'Error: Resilient-ETA date must be later than Multi-Region-ETA'});
        } else {
            this.setState({errorMsg: ''});
        }
    }

    renderQuestionInput = (id, question) => (
        <InputText
            key={id}
            id={id}
            question={question}
        />
    )

    renderRegionQuestion = (id, question, values) => (
        <div id="region-question-div" className="form-control form-group">
            <label htmlFor="region-question-div" id="region-question-label" className="form-group floating-label label">
                {question}:
            </label>
            <form className="form-inline form-group" id={id}>
                {
                    values.map((value) => (
                        <Checkbox
                            id={value}
                            key={value}
                            name={value}
                            label={value}
                            checked={this.props.regions[value]}
                            onChange={this.handleOptionClicked}
                            inline
                        />
                    ))
                }
            </form>
        </div>
    )

    renderNumericQuestion = (id, question, type, values) => (
        <InputNumber
            key={id}
            id={id}
            question={question}
            type={type}
            range={values}
        />
    )

    renderDateQuestion = (id, question) => {
        let handleDateChange = this.handleDateChange;
        let dayTemplateComponent;
        let errorMsg = '';
        let onSubmit;
        if (id === 'Multi-Region-ETA') {
            handleDateChange = this.handleMultiRegionDate;
            onSubmit = this.checkDatesError;
        } else if (id === 'Resilient-ETA') {
            handleDateChange = this.handleResilientDate;
            errorMsg = this.state.errorMsg;
            onSubmit = this.checkDatesError;
        } else if (id === 'Last-Rollback-Date') {
            handleDateChange = this.handleLastRollbackDate;
            dayTemplateComponent = DayTemplatePast;
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
        );
    }

    renderCategoryQuestion = (id, question, values) => (
        <SearchableList
            key={id}
            labelKey={id}
            options={values}
            inputProps={{
                label: question,
                id
            }}
        />
    )

    handleMultiRegionDate = (event) => this.setState({dates: {...this.state.dates, 'Multi-Region-ETA': event}})

    handleResilientDate = (event) => this.setState({dates: {...this.state.dates, 'Resilient-ETA': event}})

    handleLastRollbackDate = (event) => this.setState({dates: {...this.state.dates, 'Last-Rollback-Date': event}})

    handleDateChange = (event) => this.setState({dates: {date: event}})

    handleOptionClicked = (event) => this.props.saveRegions({[event.target.name]: event.target.checked})

    renderQuestionType = (questionObj) => {
        const id = h.replaceSpaces(questionObj.question);
        if (questionObj.type === 'category') {
            return this.renderCategoryQuestion(id, questionObj.question, questionObj.values);
        } else if (questionObj.type === 'number' || questionObj.type === 'integer') {
            return this.renderNumericQuestion(id, questionObj.question, questionObj.type, questionObj.values);
        } else if (questionObj.type === 'regions') {
            return this.renderRegionQuestion(id, questionObj.question, questionObj.values);
        } else if (questionObj.type === 'date') {
            return this.renderDateQuestion(id, questionObj.question);
        }
        return this.renderQuestionInput(id, questionObj.question);
    }

    render() {
        const {questions} = this.props;
        const style = {display: 'block'};

        return (
            questions.map((question) => (
                <Tooltip
                    placement="right"
                    tooltipType="tooltip--lg"
                    content={question.definition}
                    wrapperStyle={style}
                >
                    {this.renderQuestionType(question)}
                </Tooltip>
            ))
        );
    }
}

ResiliencyQuestions.defaultProps = {
    questions: [],
};

ResiliencyQuestions.propTypes = {
    questions: PropTypes.array,
    saveRegions: PropTypes.func,
    regions: PropTypes.object
};

export default ResiliencyQuestions;