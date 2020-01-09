import React, {Component} from 'react';
import GaugeChart from '../../components/GaugeChart';
import h from './psrHelpers'
import PropTypes from 'prop-types';

class BrandDailyPSR extends Component {
    constructor(props) {
        super(props);
        this.state= {
            isOpen: false
        }
    }

    openDetails = () => {
        this.props.onClick(this.props.brand)
    }
    
    render() {
        const {
            brand,
            dailyPSRValue,
            date,
        } = this.props;

        return (
            <div className='brandPsr' key={brand + date} onClick={this.openDetails}>
            {
                h.brandLogoFile(brand) ? 
                <img className='brandLogoImg' alt={`${brand}-logo`} src={h.brandLogoFile(brand)} height="35"/> : 
                <h3 className='brandName'>{brand}</h3>
            }
            <div className='lastUpdate'>{date ? `Last update ${date}` : ''}</div>
            <GaugeChart title={brand} value={dailyPSRValue} />
        </div>
        );
    }
}

BrandDailyPSR.propTypes = {
    brand: PropTypes.string,
    dailyPSRValue : PropTypes.number,
    date: PropTypes.string,
    onClick: PropTypes.func
};
export default BrandDailyPSR;