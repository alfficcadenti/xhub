import React, {Component} from 'react';
import h from './psrHelpers'
import PropTypes from 'prop-types';
import utils from '../../components/utils/formatString';
import './styles.less';

class BrandPSRDetails extends Component {
    constructor(props) {
        super(props);
        this.state= {
            isOpen: false
        }
    }
    
    render() {
        const {data} = this.props;

        return (
            <div id='PSRDetails'>
                <div id='detailsHeader'>
                    <span>
                        {'Line Of Business'}
                    </span>
                    <span>
                        {'Last 24h'}
                    </span>
                    <span>
                        {'Last 7 days'}
                    </span>
                    <span>
                        {'Last 28 days'}
                    </span>
                </div>
                {
                    h.listOfLOB(data).map(lob => {
                        const daily = h.findPSRValueByInterval(h.psrValuesByLOB(data, lob),'daily')
                        const weekly = h.findPSRValueByInterval(h.psrValuesByLOB(data, lob),'weekly')
                        const monthly = h.findPSRValueByInterval(h.psrValuesByLOB(data, lob),'monthly')
                        const lobstring = utils.replaceSpaces(lob)
                        return (
                            <div className='detailsRow' key={lob}>
                                <span>{lob}</span>
                                <span id={'daily'+lobstring} className={'dailyPSR'}>{daily && daily.successPercentage + ' %'}</span>
                                <span id={'weekly'+lobstring} className={'weeklyPSR'}>{weekly && weekly.successPercentage + ' %'}</span>
                                <span id={'monthly'+lobstring} className={'monthlyPSR'}>{monthly && monthly.successPercentage + ' %'}</span>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

BrandPSRDetails.propTypes = {
    data: PropTypes.array
};
export default BrandPSRDetails;