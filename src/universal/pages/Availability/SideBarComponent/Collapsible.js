import React, {Component} from 'react';
import CircleDot from '../../../components/CircleDot';
import {SVGIcon} from '@homeaway/react-svg';
import {CHEVRON_UP__12, CHEVRON_DOWN__12} from '@homeaway/svg-defs';

class Collapsible extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    togglePanel = (e) => {
        e.preventDefault();
        this.setState({open: !this.state.open});
    }

    onKeyDown = (e) => {
        e.preventDefault();
    }

    render() {
        const {status, children, title, id} = this.props;
        const {open} = this.state;
        return (
            <div className="sidebar-header">
                <div id={id} className="sidebar-title" onClick={this.togglePanel} onKeyDown={this.onKeyDown} role="button" tabIndex={0}>
                    <SVGIcon markup={open ? CHEVRON_DOWN__12 : CHEVRON_UP__12}/>
                    <span className="sidebar-title-text">{title}</span>
                    <CircleDot status={status}/>
                </div>
                {open ? (<div>{children}</div>) : null}
            </div>
        );
    }
}
export default Collapsible;