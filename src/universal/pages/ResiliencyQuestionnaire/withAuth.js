/* istanbul ignore file */
import {withAuth} from '@okta/okta-react';
import React, {Component} from 'react';

async function checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated && !this.state.userinfo) {
        const userinfo = await this.props.auth.getUser();
        this.setState({userinfo});
    }
}

export default withAuth(class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {userinfo: null};
        this.checkAuthentication = checkAuthentication.bind(this);
    }

    async componentDidMount() {
        this.checkAuthentication();
    }

    async componentDidUpdate() {
        this.checkAuthentication();
    }

    render() {
        const {userinfo} = this.state;

        return (
            <div>
                {userinfo !== null &&
                    <div>
                        <p>{`Welcome back, ${userinfo.name}!`}</p>
                    </div>
                }
                {this.state.userInfo}
            </div>
        );
    }
});
