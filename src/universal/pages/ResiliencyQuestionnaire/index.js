import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

class ResiliencyQuestionnaire extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    
    loadProductList = () => {
        // fetch('api/incident-data')
        //     .then((resp) => {
        //         if (!resp.ok) {
        //             this.setState({error: true});
        //             throw new Error;
        //         }
        //         return resp.json();
        //     })
        //     .then((data) => {
        //         const allIncidents = this.getAllIncidents(data.recordset);
        //         this.setState({
        //             allIncidents,
        //             isLoading: false
        //         })
        //     })
        //     // eslint-disable-next-line no-console
        //     .catch((error) => {console.log(error)})
    }
    
    componentDidMount() {
        this.loadProductList();
    }
    
    render() {
        return (
            <Fragment>
                <h1>Resiliency Questionnaire</h1>
                    {/*                 
                    <LoadingContainer isLoading={isLoading} error={error}>
                    { allIncidents.length}
                    </LoadingContainer> */}
            </Fragment>
        );
    }
}

ResiliencyQuestionnaire.propTypes = {
    value: PropTypes.string,
    list: PropTypes.array,
};
export default ResiliencyQuestionnaire;