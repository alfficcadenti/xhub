import React from 'react';
import {OPXHUB_SUPPORT_CHANNEL} from './../../constants';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    render() {
        if (this.state.hasError) {
            return (<div id="app-error">
                <h1>Something went wrong.</h1>
                <p>{`An unexpected error has occurred. Try refreshing the page. If this problem persists, please message ${OPXHUB_SUPPORT_CHANNEL}`}</p>
            </div>);
        }

        return this.props.children;
    }
}

export default ErrorBoundary;