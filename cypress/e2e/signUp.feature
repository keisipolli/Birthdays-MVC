Feature: Sign up for note-taking app

  Scenario: User successfully signs up with valid email and password
    Given the user navigates to the sign-up page
    When the user enters a valid email and password
    And clicks the sign-up button
    Then the user is redirected to the sign-in page

  Scenario: User attempts to sign up with an existing email
    Given the user navigates to the sign-up page
    When the user enters an email that is already registered
    And enters a valid password
    And clicks the sign-up button
    Then an error message is displayed indicating the email is already registered

  Scenario: User attempts to sign up with an invalid password
    Given the user navigates to the sign-up page
    When the user enters a valid email
    And enters an invalid password
    And clicks the sign-up button
    Then an error message is displayed indicating the password requirements are not met
