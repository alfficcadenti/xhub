import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ResiliencyQuestions from '../../components/ResiliencyQuestions';
import Modal from '@homeaway/react-modal';
import LoadingContainer from '../../components/LoadingContainer';
import h from '../../components/utils/formatString';
import Cookies from 'js-cookie';
import './styles.less';

class QuestionForm extends Component {
    constructor(props) {
        super(props);

        const productInputProps = {
            label: 'Product name',
            id: 'product-list-input'
        };

        const applicationInputProps = {
            label: 'Application name',
            id: 'application-list-input'
        };

        const product = {
            id: '',
            name: ''
        };

        const application = {
            id: '',
            name: ''
        };

        const regions = {
            'us-west-1': false,
            'us-east-1': false,
            'eu-west-1': false,
            'ap-northeast-1': false,
            'ap-southeast-1': false,
            'ap-southeast-2': false,
            'other': false
        };

        this.state = {
            productInputProps,
            applicationInputProps,
            productError: '',
            applicationError: '',
            questionError: '',
            historyError: '',
            products: [],
            applications: [],
            questions: [],
            product,
            application,
            lastQuestionnaire: [],
            answers: [],
            isOpen: false,
            modalMessage: '',
            sendingAnswers: false,
            regions,
            username: '',
        };
    }

    componentDidMount() {
        this.loadQuestionList();
        this.loadHistory(this.props.application.id);
        this.loadUserInfo();
    }

    // eslint-disable-next-line consistent-return
    loadUserInfo = () => {
        try {
            const username = Cookies.get('email').split('@')[0];
            this.setState({username});
        } catch (e) {
            return null;
        }
    }

    loadHistory = (applicationId = '') => {
        const baseUrl = '/api/v1/resiliency/questionnaires?applicationId=';
        fetch(baseUrl + applicationId)
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({historyError: 'Error. Try again.'});
                    throw new Error();
                }
                return resp.json();
            })
            .then((data) => {
                if (data.length && data[0].questionnaire.questions) {
                    const lastQuestionnaire = data.reverse()[0].questionnaire.questions;
                    const regions = lastQuestionnaire.find(({key}) => key === 'Deployed in Regions').value;
                    this.setState({
                        lastQuestionnaire,
                        regions: this.formatRegionsAnswer(regions)
                    });
                }
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    };

    formatRegionsAnswer = (regions) => {
        try {
            return JSON.parse(regions);
        } catch (e) {
            return this.state.regions;
        }
    }

    loadQuestionList = () => {
        fetch('/api/resiliency-questions')
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({questionError: 'No questions available'});
                    throw new Error();
                }
                return resp.json();
            })
            .then((data) => {
                this.setState({
                    questions: data,
                });
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    };

    getQuestionnaireAnswers = () => (
        Array.from(this.state.questions.map((x) => {
            if (x.type === 'date') {
                return {key: x.question, value: document.getElementById(`input-${h.replaceSpaces(x.question)}`).value};
            } else if (x.type === 'regions') {
                return {key: x.question, value: JSON.stringify(this.state.regions)};
            }
            return {key: x.question, value: document.getElementById(h.replaceSpaces(x.question)).value};
        }))
    );

    submitQuestionnaire = (username, product, application, questions) => {
        return fetch('/resiliency/questionnaire', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, product, application, questions})
        }).then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            return resp;
        });
    };

    checkForErrors = () => (
        (Array.from(
            document.getElementsByClassName('help-block'))
            .map(
                (x) => (x.innerHTML)
            ).filter(
                (x) => x.includes('Error')
            )
        ).length
    );

    preSubmit = () => {
        if (!this.state.username) {
            this.handleOpen();
            this.displayPostResult('Error: user not logged in, try refreshing the page');
        } else if (this.checkForErrors() > 0) {
            this.handleOpen();
            this.displayPostResult('Error: answers contain errors');
        } else {
            this.handleSubmit();
        }
    };

    handleSubmit = () => {
        this.handleOpen();
        const {product, application} = this.props;
        const {username} = this.state;
        const answers = this.getQuestionnaireAnswers();
        this.submitQuestionnaire(username, product, application, answers)
            .then((resp) => {
                if (resp !== 200) {
                    throw new Error(resp);
                }
                return resp;
            })
            .then(() => this.displayPostResult('Questionnaire successfully submitted'))
            .catch(() => this.displayPostResult('Error. Try Again.'));
    };

    displayPostResult = (message = '') => {
        this.setState({modalMessage: message, sendingAnswers: false});
    };

    handleOpen = () => {
        this.setState({isOpen: true, sendingAnswers: true});
    };

    handleClose = () => {
        this.setState({isOpen: false, modalMessage: '', sendingAnswers: false});
    };

    saveRegions = (region) => (this.setState({regions: {...this.state.regions, ...region}}))

    render() {
        const {
            questionError,
            questions,
            sendingAnswers,
            modalMessage,
            regions,
            lastQuestionnaire,
        } = this.state;
        const {
            application,
        } = this.props;

        const loadingQuestions = !questions.length && application.name && !questionError;
        return (
            <div className="resiliency-questions-form">
                <LoadingContainer isLoading={loadingQuestions} error={questionError}>
                    <h4>{'Fill the questionnaire below'}</h4>
                    <ResiliencyQuestions
                        questions={questions}
                        saveRegions={this.saveRegions}
                        regions={regions}
                        lastQuestionnaire={lastQuestionnaire}
                    />

                    <button
                        id="submitButton"
                        type="button"
                        className="btn btn-default active"
                        onClick={this.preSubmit}
                    >
                        {'Submit Questionnaire'}
                    </button>

                    <Modal
                        id="questionnaire-modal"
                        isOpen={this.state.isOpen}
                        onClose={this.handleClose}
                        header={false}
                    >
                        <LoadingContainer isLoading={sendingAnswers}>
                            {modalMessage}
                        </LoadingContainer>
                    </Modal>
                </LoadingContainer>
            </div>
        );
    }
}

QuestionForm.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    }).isRequired,
    application: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    }).isRequired
};

export default QuestionForm;