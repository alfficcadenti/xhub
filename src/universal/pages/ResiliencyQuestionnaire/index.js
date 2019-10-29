import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import InputListComponent from '../../components/InputListComponent';
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
            products: [],
            applications: [],
            product,
            application
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
            product
        } = this.state;

        const loadingProduct = !productError && !products.length;
        const loadingApplications = product.name && !applications.length;

        return (
            <Fragment>
                <h1>Resiliency Questionnaire</h1>
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
            </Fragment>
        );
    }
}

ResiliencyQuestionnaire.propTypes = {
    value: PropTypes.string,
    list: PropTypes.array,
};
export default ResiliencyQuestionnaire;