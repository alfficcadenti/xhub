import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import InputListComponent from '../../components/InputListComponent';
import ResiliencyQuestions from '../../components/ResiliencyQuestions';
import {Divider} from '@homeaway/react-collapse';
import Modal from '@homeaway/react-modal';
import './styles.less';

class ResiliencyQuestionnaire extends Component {
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
            products: [],
            applications: [],
            questions: [],
            product,
            application,
            answers: [],
            isOpen: false,
            modalMessage: ''
        };
    }

    loadProductList = () => {
        fetch('api/v1/products')
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({productError: 'Error: Products list not available. Try to refresh'});
                    throw new Error;
                }
                return resp.json();
            })
            .then((data) => {
                this.setState({
                    products: data.content
                })
            })
            // eslint-disable-next-line no-console
            .catch((error) => {console.log(error)})
    }

    loadApplicationList = (productName) => {
        const url = 'api/v1/applications?product='+productName;
        fetch(url)
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({applicationError: 'No application for this product'});
                    throw new Error;
                }
                return resp.json();
            })
            .then((data) => {
                if (!data.content.length) {
                    this.setState({applicationError: 'No application for this product'});
                } else {
                    this.setState({
                        applications: data.content,
                        applicationError: ''
                    })    
                }
            })
            // eslint-disable-next-line no-console
            .catch((error) => {console.log(error)});
    }

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

    selectProduct = (product) => {
        const newProduct = {
            id: product[0] && product[0].id,
            name: product[0] && product[0].name
        }

        const application = {
            id: '',
            name: ''
        }

        this.setState({
            product: newProduct,
            application
        })

        newProduct.name && this.loadApplicationList(newProduct.name)
    }

    selectApplication = (application) => {
        const newApplication = {
            id: application[0] && application[0].id,
            name: application[0] && application[0].name
        }
        this.setState({
            application: newApplication,
        })
        newApplication.name && this.loadQuestionList();
    }

    getQuestionnaireAnswers = () => {
        const questionnaireDOM = document.getElementById('resiliency-questions-form').getElementsByClassName('FormTextArea__textarea');
        return Array.from(questionnaireDOM).map(({id, value}) => ({ key: id, value}));
    }

    submitQuestionnaire = (product, application,questions) => {
        return fetch('/api/v1/resiliency/questionnaire', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({product, application, questions})
        })
    }

    handleSubmit = () => {
        const {product, application} = this.state;
        const questions = this.getQuestionnaireAnswers();
        this.submitQuestionnaire(product, application,questions).then(resp => {
            if (!resp.ok) {
                throw new Error(resp);
            }
            return resp.json();
        }) 
        .then(result => {
            this.questionnaireSuccess(result)
        })
        .catch(error => {
            this.questionnaireError(error)
        });
    }

    questionnaireSuccess = () => {
        this.setState({modalMessage: 'Questionnaire succesfully submitted'});
        this.handleOpen();
    }

    questionnaireError = () => {
        this.setState({modalMessage: 'Error. Try Again.'});
        this.handleOpen();
    }

    handleOpen = () => {
        this.setState({isOpen: true});
    }

    handleClose = () => {
        this.setState({isOpen: false, modalMessage: ''});
    }
    
    componentDidMount() {
        this.loadProductList();
    }
    
    render() {
        const {
            productInputProps,
            applicationInputProps,
            productError,
            applicationError,
            questionError,
            applications,
            questions,
            products,
            product,
            application,
            modalMessage
        } = this.state;

        const loadingProduct = !products.length && !productError;
        const loadingApplications = !applications.length && product.name && !applicationError;
        const loadingQuestions = !questions.length && application.name && !questionError;

        return (
            <Fragment>
                <h1>{"BEX 'r' Certification Resiliency Questionnaire"}</h1>
                <div id='resiliency-questions-form'>
                    {
                        <InputListComponent 
                            isLoading={loadingProduct} 
                            error={productError} 
                            options={products}
                            inputProps={productInputProps}
                            onChange={this.selectProduct}
                        />
                    }
                    
                    {
                        product.name && <InputListComponent 
                        isLoading={loadingApplications} 
                        error={applicationError} 
                        options={applications} 
                        inputProps={applicationInputProps}
                        onChange={this.selectApplication}
                        />
                    }

                    {
                        product.name && application.name && <Divider heading="Fill the below questionnaire" expanded={true}>
                            <ResiliencyQuestions 
                                isLoading={loadingQuestions} 
                                error={questionError} 
                                questions={questions}
                            />
                            <button 
                                id='submitButton'
                                type="button" 
                                className='btn btn-default active'
                                onClick={this.handleSubmit}>
                                Submit Questionnaire
                            </button>
                        </Divider>
                    }
                    <Modal
                        id="questionnaire-modal"
                        isOpen={this.state.isOpen}
                        onClose={this.handleClose}
                        header={false}
                    >
                        {modalMessage}
                    </Modal>
                </div>
            </Fragment>
        );
    }
}

ResiliencyQuestionnaire.propTypes = {
    value: PropTypes.string,
    list: PropTypes.array,
};
export default ResiliencyQuestionnaire;