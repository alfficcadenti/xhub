import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import InputListComponent from '../../components/InputListComponent';
import {Route, Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
import './styles.less';
import QuestionForm from './QuestionForm';
import History from './History';
import {Navigation} from '@homeaway/react-navigation';

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
            historyError: '',
            products: [],
            applications: [],
            questions: [],
            product,
            application,
            answers: [],
            isOpen: false,
            modalMessage: '',
            activeIndex: 0
        };

        this.links = [
            {
                id: 'questions', 
                label: 'Questionnaire', 
                href: '/resiliency-questionnaire/questions',
                node: <Link to="/resiliency-questionnaire/questions">{'Questionnaire'}</Link>

            },
            {
                id: 'history', 
                label: 'History', 
                href: '/resiliency-questionnaire/history',
                node: <Link to="/resiliency-questionnaire/history">{'History'}</Link>
            }            
        ];
    }

    loadProductList = () => {
        fetch('/api/v1/products')
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

    loadApplicationList = (productName = '') => {
        const url = '/api/v1/applications?product='+productName;
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
    }

    handleNavigationClick = async (e, activeIndex) => {
        this.setState({
            activeIndex
        });
    }

    renderQuestions = () => {
        const {product, application} = this.state;
        return (product.name && application.name && <QuestionForm 
        application={application}
        product={product}
    />)
    }

    renderHistory = () => {
        const {product, application} = this.state;
        return (product.name && application.name && <History 
            applicationId={application.id}
        />)
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
            applications,
            products,
            product,
            application,
            activeIndex
        } = this.state;

        const loadingProduct = !products.length && !productError;
        const loadingApplications = !applications.length && product.name && !applicationError;

        return (
            <Fragment>
                <h1 id='pageTitle'>{"BEX 'r' Certification Resiliency Questionnaire"}</h1>
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
                        product.name && application.name && 
                        <Fragment>
                            <Navigation
                            noMobileSelect={false}
                            activeIndex={activeIndex}
                            links={this.links}
                            onLinkClick={this.handleNavigationClick}
                            />
                            <Redirect to={this.links[activeIndex].href} />
                            <Route 
                                path="/resiliency-questionnaire/questions" 
                                render={this.renderQuestions} 
                            />
                            <Route 
                                path="/resiliency-questionnaire/history" 
                                render={this.renderHistory} 
                            />
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