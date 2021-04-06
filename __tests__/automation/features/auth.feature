Feature: Authenticate user

  @acceptance @desktop
  Scenario Outline: User is able sign in

    Given user goes to okta
    Then user wait for login page
    Then user types username in login
    Then user clicks submit
    Then user wait for password page
    Then user types password in password
    Then user clicks verify
    Then user wait to successfully login

    Examples:
    | brand   |
    | Expedia |
