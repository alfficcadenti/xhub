import React, {Component, Fragment} from 'react';
import SearchableList from '@homeaway/react-searchable-list';
import PropTypes from 'prop-types';
import './styles.less';

class ResiliencyQuestionnaire extends Component {
    constructor(props) {
        super(props);

        const options=['apple',
        'apricot',
        'avocado',
    ];

    const inputProps = {
        label: 'Product name',
        id: 'searchable-list-input'
    };

        this.state = {
            options,
            inputProps,
            productList: []
        };
    }
    
    loadProductList = () => {
        fetch('api/product-list')
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({error: true});
                    throw new Error;
                }
                return resp.json();
            })
            .then((data) => {
                // eslint-disable-next-line no-console
                //console.log(Object.keys(data))
                const productList = Object.values(data).map(prod => prod.name)
                // eslint-disable-next-line no-console
                console.log(productList)
                this.setState({
                    productList
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
            productList,
            inputProps
        } = this.state;
        return (
            <Fragment>
                <h1>Resiliency Questionnaire</h1>
                <SearchableList 
                    options={productList} 
                    inputProps={inputProps}
                />
            </Fragment>
        );
    }
}

ResiliencyQuestionnaire.propTypes = {
    value: PropTypes.string,
    list: PropTypes.array,
};
export default ResiliencyQuestionnaire;