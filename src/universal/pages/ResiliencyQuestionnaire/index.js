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

        const TierInputProps = {
            label: 'Service Tier',
            id: 'tier-list-input'
        };

        const lobInputProps = {
            label: 'Line of Business name',
            id: 'lob-list-input'
        };

        const productInputProps = {
            label: 'Product name',
            id: 'product-list-input'
        };

        const applicationInputProps = {
            label: 'Application name',
            id: 'application-list-input'
        };

        const lob = {
            id: '',
            name: ''
        }

        const product = {
            id: '',
            name: ''
        }

        const application = {
            id: '',
            name: ''
        }

        this.state = {
            lobInputProps,
            productInputProps,
            applicationInputProps,
            TierInputProps,
            lobError: '',
            productError: '',
            applicationError: '',
            questionError: '',
            historyError: '',
            lobs: [],            
            products: [],
            applications: [],
            questions: [],
            lob,
            product,
            tierFilter: [],
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

    loadLoBList = () => {
        fetch('/api/v1/lob')
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({lobError: 'Error: Lines of Business list not available. Try to refresh'});
                    throw new Error;
                }
                return resp.json();
            })
            .then((data) => {
                this.setState({
                    lobs: data.content
                })
            })
            // eslint-disable-next-line no-console
            .catch((error) => {console.log(error)})
    }

    loadProductList = (lobName = '') => {
        const url = '/api/v1/products?lob='+lobName;
        fetch(url)
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({productError: 'Error: Products list not available. Try to refresh'});
                    throw new Error;
                }
                return resp.json();
            })
            .then((data) => {
                if(!data.content.length) {
                    this.setState({productError: 'No products for this LoB'});
                } else {
                    this.setState({
                        products: data.content
                    })
                }
            })
            // eslint-disable-next-line no-console
            .catch((error) => {console.log(error)})
    }

    loadApplicationList = (productName = '') => {
        const url = '/api/v1/applications?product='+productName;
        fetch(url)
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({applicationError: 'No applications for this product'});
                    throw new Error;
                }
                return resp.json();
            })
            .then((data) => {
                if (!data.content.length) {
                    this.setState({applicationError: 'No applications for this product'});
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

    selectLob = (lob) => {
        const newLob = {
            id: lob[0] && lob[0].id,
            name: lob[0] && lob[0].name
        }

        const product = {
            id: '',
            name: ''
        }

        const application = {
            id: '',
            name: ''
        }

        this.setState({
            lob: newLob,
            product,
            application,
            productError: ''
        })

        newLob.name && this.loadProductList(newLob.name)
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
            application,
            applicationError: ''
        })

        newProduct.name && this.loadApplicationList(newProduct.name)
    }

    selectTier = (tier) => {
        const application = {
            id: '',
            name: ''
        }
        this.setState({
            tierFilter: tier,
            application
        })
    }

    filteredApplications = () => {
        const {tierFilter, applications} = this.state;
        const filteredApplications = tierFilter.length ? applications.filter(app => app.serviceTier === tierFilter[0]) : applications
        return filteredApplications
    }

    selectApplication = (application) => {
        let newApplication = {
            id: application[0] ? application[0].id : '',
            name: application[0] ? application[0].name : ''
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
        this.loadLoBList();
    }
    
    render() {
        const {
            lobInputProps,
            productInputProps,
            applicationInputProps,
            TierInputProps,
            productError,
            lobError,
            applicationError,
            applications,
            lobs,
            products,
            lob,
            product,
            application,
            activeIndex
        } = this.state;

        const loadingLob = !lobs.length && !lobError;
        const loadingProduct = !products.length && !productError;
        const loadingApplications = !applications.length && product.name && !applicationError;

        const filteredApplications = this.filteredApplications();

        return (
            <Fragment>
                <h1 id='pageTitle'>{"BEX 'r' Certification Resiliency Questionnaire"}</h1>
                <div id='resiliency-questions-form'>
                    {
                        <InputListComponent 
                            isLoading={loadingLob} 
                            error={lobError} 
                            options={lobs}
                            inputProps={lobInputProps}
                            onChange={this.selectLob}
                        />
                    }

{
                        lob.name && <InputListComponent 
                            isLoading={loadingProduct} 
                            error={productError} 
                            options={products}
                            inputProps={productInputProps}
                            onChange={this.selectProduct}
                        />
                    }

                    {
                        product.name && <div id='applicationForm'>
                            {!applicationError && !application.name.length &&
                                <InputListComponent 
                                isLoading={loadingApplications} 
                                error={applicationError} 
                                options={['Tier 1', 'Tier 2','Tier 3']} 
                                inputProps={TierInputProps}
                                onChange={this.selectTier}
                                />
                            }
                            <InputListComponent 
                                id='applicationNameInput'
                                isLoading={loadingApplications} 
                                error={applicationError} 
                                options={filteredApplications} 
                                inputProps={applicationInputProps}
                                onChange={this.selectApplication}
                                />
                        </div>
                    }

                    {
                        lob.name && product.name && application.name && 
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