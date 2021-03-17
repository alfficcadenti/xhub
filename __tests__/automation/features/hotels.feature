Feature: Verify user is able to navigate around hotels.com pages

  @acceptance @desktop
  Scenario Outline: User is able to use the nav bar to navigate

    Given user visit opXHub homepage on <brand>
    Then the current page is homepage
    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the availabilityTrendsLink1
    Then the current page title contain Checkout Success Rate

    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the availabilityTrendsLink2
    Then the current page title contain Impulse Dashboard

    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the availabilityTrendsLink3
    Then the current page title contain Page Views

    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the availabilityTrendsLink4
    Then the current page title contain Operational Dashboard

    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the availabilityTrendsLink5
    Then the current page title contain Operational TV

    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the availabilityTrendsLink6
    Then the current page title contain Reservations

    Then user clicks on the Availability & Trends Button
    Then user verify availabilityTrendsDropdown exist
    Then user go ahead and clicks on the availabilityTrendsLink7
    Then the current page title contain Success Rates

    Then user clicks on the Platform Health & Resiliency Button
    Then user verify platformHealthResiliencyDropdown exist
    Then user go ahead and clicks on the platformHealthResiliencyLink1
    Then the current page title contain Incident Trends

    Then user clicks on the Platform Health & Resiliency Button
    Then user verify platformHealthResiliencyDropdown exist
    Then user go ahead and clicks on the platformHealthResiliencyLink2
    Then the current page title contain Quality Trends

    Then user clicks on the Platform Health & Resiliency Button
    Then user verify platformHealthResiliencyDropdown exist
    Then user go ahead and clicks on the platformHealthResiliencyLink3
    Then the current page title contain Quality Metrics

    Then user clicks on the Platform Health & Resiliency Button
    Then user verify platformHealthResiliencyDropdown exist
    Then user go ahead and clicks on the platformHealthResiliencyLink4
    Then the current page title contain Problem Management

    Then user clicks on the Platform Health & Resiliency Button
    Then user verify platformHealthResiliencyDropdown exist
    Then user go ahead and clicks on the platformHealthResiliencyLink5
    Then the current page title contain Change Finder
    
    Then user clicks on the Outage Report Button
    Then user verify outageReportDropdown exist
    Then user go ahead and clicks on the outageReportLink1
    Then the current page title contain Outage Report


    Examples:
    | brand      |
    | Hotelscom  |
