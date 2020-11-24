import React, {useState, useRef, useEffect, Fragment} from 'react';
import UniversalSearch from '../UniversalSearch';
import {SVGIcon} from '@homeaway/react-svg';
import {FILTER__16} from '@homeaway/svg-defs';
import {Checkbox} from '@homeaway/react-form-components';
import LoadingContainer from '../LoadingContainer';
import './styles.less';


const Annotations = ({isDeploymentsAnnotationsLoading,
    isIncidentsAnnotationsLoading,
    isAbTestsAnnotationsLoading,
    deploymentAnnotationsError,
    incidentAnnotationsError,
    abTestsAnnotationsError,
    deploymentCategory,
    incidentCategory,
    abTestsCategory,
    setDeploymentCategory,
    setIncidentCategory,
    setAbTestsCategory,
    suggestions,
    productMapping,
    onFilterChange
}) => {
    const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
    const [displayError, setDisplayError] = useState('');
    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setOpenAdvancedFilter(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    });

    useEffect(() => {
        const annotationError = 'An unexpected error has occurred loading the annotations. Try refreshing the page. If this problem persists, please message #dpi-reo-opex-all or fill out our Feedback form.';
        if (deploymentAnnotationsError && incidentAnnotationsError && abTestsAnnotationsError) {
            setDisplayError(annotationError);
        }
    }, [deploymentAnnotationsError, incidentAnnotationsError, abTestsAnnotationsError]);

    return (
        <Fragment>
            <button
                onClick={() => setOpenAdvancedFilter(!openAdvancedFilter)}
                className={`btn btn-default display-annotations-btn ${openAdvancedFilter ? 'active' : ''}`}
                type="button"
            >
                <SVGIcon usefill markup={FILTER__16} />{' Display Annotations'}
            </button>
            {openAdvancedFilter && <div className="annotations-wrapper" ref={ref}>
                <LoadingContainer
                    isLoading={isDeploymentsAnnotationsLoading || isIncidentsAnnotationsLoading || isAbTestsAnnotationsLoading}
                    error={displayError}
                    className="annotations-filters-container"
                >
                    <div className="annotations-category-filters">
                        <h4>{'Annotations:'}</h4>
                        <Checkbox
                            name="deployment-сheckbox"
                            label="Deployments"
                            checked={deploymentCategory}
                            onChange={() => setDeploymentCategory(!deploymentCategory)}
                            size="sm"
                            disabled={deploymentAnnotationsError}
                        />
                        <Checkbox
                            name="incident-сheckbox"
                            label="Incidents"
                            checked={incidentCategory}
                            onChange={() => setIncidentCategory(!incidentCategory)}
                            size="sm"
                            disabled={incidentAnnotationsError}
                        />
                        <Checkbox
                            name="incident-сheckbox"
                            label="A/B tests"
                            checked={abTestsCategory}
                            onChange={() => setAbTestsCategory(!abTestsCategory)}
                            size="sm"
                            disabled={abTestsAnnotationsError}
                        />
                    </div>
                    {typeof onFilterChange === 'function' &&
                        <UniversalSearch
                            suggestions={suggestions}
                            suggestionMapping={productMapping}
                            onFilterChange={onFilterChange}
                        />
                    }
                </LoadingContainer>
            </div>}
        </Fragment>
    );
};

export default Annotations;
