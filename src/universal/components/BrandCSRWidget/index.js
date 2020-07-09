import React from 'react';
import brandLogoFile from '../utils/brandLogoFile';
import {RadialProgress} from 'react-radial-progress-indicator';
import Trend from 'react-trend';
import './styles.less';

const alertThreshold = 95;
const isNotAlert = (arrayData) => arrayData.slice(-1)[0] >= alertThreshold;
const alertColor = '#ff0000';
const defaultColor = '#00008d';

const deviceBars = (CSRByDevice) => (
    CSRByDevice.mobile && CSRByDevice.tablet && CSRByDevice.desktop ? <div id="psr-bar">
        <div id="psr-bar-1" style={{width: CSRByDevice.mobile}}><span>{CSRByDevice.mobile}</span><span className="text">{'mobile'}</span></div>
        <div id="psr-bar-2" style={{width: CSRByDevice.tablet}}><span>{CSRByDevice.tablet}</span><span className="text">{'tablet'}</span></div>
        <div id="psr-bar-3" style={{width: CSRByDevice.desktop}}><span>{CSRByDevice.desktop}</span><span className="text">{'desktop'}</span></div>
    </div> : ''
);

const logo = (brandName) => (brandLogoFile(brandName) ?
    <img className="brand-logo-img" alt={`${brandName}-logo`} src={brandLogoFile(brandName)} /> :
    <h2 className="brand-name">{brandName}</h2>
);

const BrandCSRWidget = ({brandName = '', CSRTrend = [], CSRByDevice = {}, onBrandChange}) => {
    const CSRTrendCleaned = CSRTrend.filter((n) => n && !isNaN(n));
    return (
        <div className="brand-data-card card" key={brandName} >
            {logo(brandName)}
            <a rel="noopener noreferrer" href="/funnel-view" onClick={() => onBrandChange([brandName])} >
                <div className="csr-widget-overlay" />
            </a>
            <h3>{'Checkout Success Rate'}</h3>
            <div className="success-rate-card">
                <div className="success-rates">
                    <span className="radial-success-rate">
                        <RadialProgress
                            duration={1000}
                            fontRatio={4}
                            ringFgColour={isNotAlert(CSRTrendCleaned) ? defaultColor : alertColor}
                            ringThickness={0.2}
                            segmented={false}
                            showIntermediateProgress
                            startStep={0}
                            step={CSRTrendCleaned.slice(-1)[0]}
                            steps={100}
                            text={function text(steps, proportion) {
                                return ''.concat(Math.floor(100 * proportion), '%');
                            }}
                        />
                    </span>
                    {CSRByDevice ? deviceBars(CSRByDevice) : ''}
                </div>
            </div>
            <Trend smooth
                autoDraw
                autoDrawDuration={2000}
                autoDrawEasing="ease-out"
                data={CSRTrendCleaned}
                gradient={isNotAlert(CSRTrendCleaned) ? [defaultColor] : [alertColor]}
                radius={10}
                strokeWidth={3}
                strokeLinecap={'round'}
            />
        </div>
    );
};


export default BrandCSRWidget;
