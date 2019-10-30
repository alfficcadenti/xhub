import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import InputListComponent from '../../components/InputListComponent';
import ResiliencyQuestions from '../../components/ResiliencyQuestions';
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
            answers: []
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
                this.setState({
                    applications: data.content,
                })
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

    handleSubmit = () => {
        const questionnaireDOM = document.getElementsByClassName('FormTextArea__textarea');
        const {product, application} = this.state;
        const questions = Array.from(questionnaireDOM).map(({id, value}) => ({ key: id, value}))
        const questionnaire = {product, application,questions}
        fetch('/api/v1/resiliency/questionnaire', {
            method: 'POST',
            body: JSON.stringify(questionnaire)
        })
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
            application
        } = this.state;

        const loadingProduct = !products.length && !productError;
        const loadingApplications = !applications.length && product.name && !applicationError;
        const loadingQuestions = !questions.length && application.name && !questionError;

        return (
            <Fragment>
                <h1>Resiliency Questionnaire</h1>
                <div className='resiliency-questions-form'>
                    {<InputListComponent 
                        isLoading={loadingProduct} 
                        error={productError} 
                        options={products}
                        inputProps={productInputProps}
                        onChange={this.selectProduct}
                    />}
                    
                    {product.name && <InputListComponent 
                        isLoading={loadingApplications} 
                        error={applicationError} 
                        options={applications} 
                        inputProps={applicationInputProps}
                        onChange={this.selectApplication}
                    />}

                    {
                        product.name && application.name && <Fragment>
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
                                Submit
                            </button>
                        </Fragment>
                    }
                    
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