import React, {Component, Fragment} from 'react';
import 'moment-timezone';
import LoadingContainer from '../../components/LoadingContainer';
import GaugeChart from '../../components/GaugeChart';
import h from './psrHelpers'
import './styles.less';

class PSR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: true
        };
        
    }
    
    loadPsr = () => {
        fetch('/api/v1/psr')
            .then((resp) => {
                if (!resp.ok) {
                    this.setState({error: 'Psr not available. Try to refresh'});
                    throw new Error;
                }
                return resp.json();
            })
            .then((data) => {
                this.setState({
                    data,
                    isLoading: false
                })
            })
            // eslint-disable-next-line no-console
            .catch((error) => {console.log(error)})
    }

    psrValuesToDisplay = (data = []) => (
        h.listOfBrands(data)
            .map(
            x => (h.getPSROnDate(h.psrValuesByBrand(data,x),h.lastPSRAvailableDate(h.psrValuesByBrand(data,x))))
        )
    )

    psrRender = (brand,value,date) => (
        <div className='brandPsr' key={brand + date}>
            {
                h.brandLogoFile(brand) ? 
                <img className='brandLogoImg' alt={`${brand}-logo`} src={h.brandLogoFile(brand)} height="35"/> : 
                <h3 className='brandName'>{brand}</h3>
            }
            <div className='lastUpdate'>{date ? `Last update ${date}` : ''}</div>
            <GaugeChart title={brand} value={value} />
        </div>
    )
    
    componentDidMount() {
        this.loadPsr();
    }
    
    render() {
        const {isLoading, data} = this.state;
        const psrValues = !isLoading && this.psrValuesToDisplay(data);
        return (
            <Fragment>
                <h1 id='pageTitle'>Purchase Success Rates</h1>
                <LoadingContainer isLoading={isLoading}>
                    <div id='psrContainer'>
                        {
                            !isLoading && 
                            psrValues.map(
                                psr=>(
                                    this.psrRender(psr.brand,psr.successPercentage,psr.date
                                    )
                                )
                            )
                        }
                    </div>
                </LoadingContainer>
            </Fragment>
        );
    }
}

export default PSR;