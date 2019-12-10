import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ResiliencyQuestions from '../../components/ResiliencyQuestions';
import Modal from '@homeaway/react-modal';
import LoadingContainer from '../../components/LoadingContainer';
import Cookies from 'js-cookie'
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
        }

        const application = {
            id: '',
            name: ''
        }

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
            answers: [],
            isOpen: false,
            modalMessage: '',
            sendingAnswers: false
        };
    }

    loadUserInfo = () => (Cookies.get('username'));

    loadQuestionList = () => {
        fetch('/api/resiliency-questions')
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({questionError: 'No questions available'});
                    throw new Error;
                }
                return resp.json();
            })
            .then((data) => {
                this.setState({
                    questions: data,
                })
            })
            // eslint-disable-next-line no-console
            .catch((error) => {console.log(error)});
    }

    getQuestionnaireAnswers = () => {
        //to be refactored using refs
        const questionnaireDOM = document.getElementById('resiliency-questions-form').getElementsByClassName('FormTextArea__textarea');
        return Array.from(questionnaireDOM).map(({id, value}) => ({ key: id, value}));
    }

    submitQuestionnaire = (product, application, questions) => {
        const username = this.loadUserInfo();
        // eslint-disable-next-line no-console
        console.log(username)
        return fetch('/api/v1/resiliency/questionnaire', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, product, application, questions})
        })
    }

    handleSubmit = () => {
        this.handleOpen();
        const {product, application} = this.props;
        const questions = this.getQuestionnaireAnswers();
        this.submitQuestionnaire(product, application, questions).then(resp => {
            if (!resp.ok) {
                throw new Error(resp);
            }
            return resp.json();
        }) 
        // eslint-disable-next-line no-console
        .then((res) => {console.log(res);this.displayPostResult('Questionnaire successfully submitted')})
        .catch(() => this.displayPostResult('Error. Try Again.'));
    }

    displayPostResult = (message = '') => {
        this.setState({modalMessage: message, sendingAnswers: false});
    }

    handleOpen = () => {
        this.setState({isOpen: true, sendingAnswers: true});
    }

    handleClose = () => {
        this.setState({isOpen: false, modalMessage: '', sendingAnswers: false});
    }
    
    componentDidMount() {
        this.loadQuestionList();
    }
    
    render() {
        const {
            questionError,
            questions,
            sendingAnswers,
            modalMessage
        } = this.state;
        const {
            application,
        } = this.props;

        const loadingQuestions = !questions.length && application.name && !questionError;

        return (
            <LoadingContainer isLoading={loadingQuestions} error={questionError}>
                        <h4>Fill the questionnaire below</h4>
                            <ResiliencyQuestions 
                                questions={questions}
                            />
                            <button 
                                id='submitButton'
                                type="button" 
                                className='btn btn-default active'
                                onClick={this.handleSubmit}>
                                Submit Questionnaire
                            </button>
                    
                    
                    <Modal
                        id="questionnaire-modal"
                        isOpen={this.state.isOpen}
                        onClose={this.handleClose}
                        header={false}
                    >
                        <LoadingContainer isLoading={sendingAnswers}>{modalMessage}</LoadingContainer>
                        
                    </Modal>
            </LoadingContainer>
        );
    }
}

QuestionForm.propTypes = {
    product: PropTypes.object,
    application: PropTypes.object,
};
export default QuestionForm;