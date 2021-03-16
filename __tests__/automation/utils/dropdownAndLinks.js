/*
* This js file provide a mapping and it is optional
* The goal is to be able to pass the variable dynamically
* in a user readable way
*
* *  readable name : actual element in the pageObj
*   ex. 'google search button' : 'googleSearchBtn'
*
*  And in the pageObj file, we do
*   elements: {
        googleSearchBtn: {
            selector: '.google .searchBtn'
        },
*    }
*
* We can directly pass the pageObj name from the feature file as well
* see other example in the homepage feature file
* */

export const dropdownAndLinks = {
    'Availability & Trends Button': 'availabilityTrendsButton',
    'Platform Health & Resiliency Button': 'platformHealthResiliencyButton',
    'Outage Report Button': 'outageReportButton',
    'Brands Filter Button': 'brandsFilterButton'
};
