import React, {Component, Fragment} from 'react';
import SearchableList from '@homeaway/react-searchable-list';
import PropTypes from 'prop-types';
import LoadingContainer from '../../components/LoadingContainer';
import './styles.less';

class ResiliencyQuestionnaire extends Component {
    constructor(props) {
        super(props);

        const productInputProps = {
            label: 'Product name',
            id: 'product-list-input'
        };

        this.state = {
            productInputProps,
            error:'',
            products: []
        };
    }

    loadProductList = () => {
        fetch('api/v1/products')
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({error: true});
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
    
    componentDidMount() {
        this.loadProductList();
    }
    
    render() {
        const {
            products,
            productInputProps,
            error
        } = this.state;
        const isLoading = !error && !products.length

        return (
            <Fragment>
                <h1>Resiliency Questionnaire</h1>
                <LoadingContainer isLoading={isLoading} error={error}>
                    <SearchableList 
                        labelKey="name"
                        options={products}
                        inputProps={productInputProps}
                    />
                </LoadingContainer>
            </Fragment>
        );
    }
}

ResiliencyQuestionnaire.propTypes = {
    value: PropTypes.string,
    list: PropTypes.array,
};
export default ResiliencyQuestionnaire;