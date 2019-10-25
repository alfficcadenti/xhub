import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types';
import ButtonAlert from '../ButtonAlert/ButtonAlert';
import styles from './Welcome.less';
import logo from './catalyst-logo.png';

class Welcome extends Component {
    constructor (props) {
        super(props);
        this.state = {
            data: ''
        };
    }

    click = () => {
        fetch('/api/getdata').then((res) => {         
            if (!res.ok) {
                throw new Error('something bad');
            }
            
            return res.json();
        }).then((payload) => {
            this.setState({data: payload});
        });
    }

    render() {
        const {data = {}} = this.state;

        return (
            <Fragment>
                <h1>Welcome to Catalyst!</h1>

                <div> ================== </div>
                <p>{data.data}</p>
                <div> ================== </div>

                <p><img src={logo} width='150' height='150' /></p>
                <p>This is a basic Catalyst Application</p>
                <p>Value = <strong className={styles.red}>{this.props.value}</strong>.</p>
                <ul>
                {this.props.list.map(({id, title}) => (<li key={id}>{title}</li>))}
                </ul>
                <ButtonAlert onClick={this.click} text='Click Me!' />
                <p>
                    <a href="/incident-trends">Go Incident trends</a>
                </p>
                <p>
                    <Link to='/incident-trends'>Go Incident trends</Link>
                </p>
            </Fragment>
        );
    }
}

Welcome.propTypes = {
    value: PropTypes.string,
    list: PropTypes.array
};
export default Welcome;
