import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import SavedQuestionnaire from '../../components/SavedQuestionnaire';
import './styles.less';

class History extends Component {
    constructor(props) {
        super(props);

        this.state = {
            historyError: '',
            history: [],
        };
    }

    loadHistory = (applicationId = '') => {
        const baseUrl = '/api/v1/resiliency/questionnaires?applicationId='
        fetch(baseUrl+applicationId)
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({historyError: 'Error. Try again.'});
                    throw new Error;
                }
                return resp.json();
            })
            .then((data) => {
                if (!data.length) {
                    this.setState({historyError: 'No questionnaire submitted previously'});
                } else {
                    this.setState({
                        history: data,
                        historyError: ''
                    })    
                }
            })
            // eslint-disable-next-line no-console
            .catch((error) => {console.log(error)});
    }
    
    componentDidMount() {
        this.loadHistory(this.props.applicationId);
    }
    
    render() {
        const {
            historyError,
            history,
        } = this.state;
        const {
            applicationId,
        } = this.props;

        const loadingHistory = !history && applicationId && !historyError;
        return (
            <Fragment>
                        <SavedQuestionnaire 
                            history={history} 
                            error={historyError} 
                            isLoading={loadingHistory}
                        />
            </Fragment>
        );
    }
}

History.propTypes = {
    applicationId: PropTypes.number,
};
export default History;