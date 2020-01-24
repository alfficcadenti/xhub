/* istanbul ignore file */
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
            isLoading: false
        };
    }

    componentDidMount() {
        this.loadHistory(this.props.applicationId);
    }

    loadHistory = (applicationId = '') => {
        this.setState({isLoading: true});
        const baseUrl = '/api/v1/resiliency/questionnaires?applicationId=';
        fetch(baseUrl + applicationId)
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({historyError: 'Error. Try again.'});
                    throw new Error();
                }
                return resp.json();
            })
            .then((data) => {
                if (!data.length) {
                    this.setState({
                        historyError: 'No questionnaire submitted previously',
                        isLoading: false
                    });
                } else {
                    this.setState({
                        history: data,
                        historyError: '',
                        isLoading: false
                    });
                }
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    };

    render() {
        const {
            historyError,
            history,
            isLoading
        } = this.state;

        return (
            <Fragment>
                <SavedQuestionnaire
                    history={history.reverse()}
                    error={historyError}
                    isLoading={isLoading}
                />
            </Fragment>
        );
    }
}

History.propTypes = {
    applicationId: PropTypes.number,
};
export default History;
