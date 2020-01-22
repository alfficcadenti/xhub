import React, {Component, Fragment} from 'react';
import 'moment-timezone';
import LoadingContainer from '../../components/LoadingContainer';
import BrandDailyPSR from './BrandDailyPSR';
import BrandPSRDetails from './BrandPSRDetails';
import h from './psrHelpers'
import './styles.less';

class PSR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: true,
            openDetails: false,
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

    lastDailyPSRValuesToDisplayByBrand = (data = []) => {
        const psrDailyData = h.psrValuesByLOB((h.psrValuesByInterval(data,'daily')),'PSR')
        return h.listOfBrands(psrDailyData)
        .map(
            x => {
                const psrData = h.psrValuesByBrand(psrDailyData,x);
                return h.getPSROnDate(psrData,h.lastPSRAvailableDate(psrData))
            }
        )
    }

    displayPSRDetails = (brand) => {
        this.setState({
            selectedBrand: brand, 
            openDetails: true
        })
    }

    componentDidMount() {
        this.loadPsr();
    }
    
    render() {
        const {isLoading, data, openDetails, selectedBrand} = this.state;
        const lastDailyPSRValuesByBrand = !isLoading && this.lastDailyPSRValuesToDisplayByBrand(data);
        const error = !isLoading && lastDailyPSRValuesByBrand.length===0 ? 'Error: No Daily PSR to display' : ''
        const brandLOBPSRs = selectedBrand && h.psrValuesByDate(h.psrDetailsByBrand(data,selectedBrand),h.lastPSRAvailableDate(h.psrDetailsByBrand(data,selectedBrand)))
        const brandDailyPSRs = selectedBrand && h.extractDataForPSRChart(data,selectedBrand)

        return (
            <Fragment>
                <h1 id='pageTitle'>Purchase Success Rates</h1>
                <LoadingContainer isLoading={isLoading} error={error}>
                    <div id='psrContainer'>
                        <div id='dailyPsrContainer'>
                            {
                                !isLoading && !error && 
                                lastDailyPSRValuesByBrand.map(
                                    psr => (
                                        <BrandDailyPSR 
                                            key={psr.brand+'PSRComponent'} 
                                            brand={psr.brand} 
                                            dailyPSRValue={psr.successPercentage} 
                                            date={psr.date} 
                                            onClick={this.displayPSRDetails}
                                            selected = {psr.brand === selectedBrand}
                                        />
                                    )
                                )
                            }
                        </div>
                        {
                            openDetails && selectedBrand && brandLOBPSRs.length!==0 &&
                            <BrandPSRDetails 
                                data={brandLOBPSRs}  
                                dailyData={brandDailyPSRs}
                            />
                        }
                    </div>
                </LoadingContainer>
            </Fragment>
        );
    }
}

export default PSR;