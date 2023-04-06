Feature: Sign in to BirthdayBook App

  Scenario: User successfully signs in with valid email and password
    Given the user navigates to the sign-in page
    When the user enters a valid email and password
    And clicks the sign-in button
    Then the user is redirected to the home page

  Scenario: User attempts to sign in with an invalid email
    Given the user navigates to the sign-in page
    When the user enters an email that is not registered
    And enters a valid password
    And clicks the sign-in button
    Then an error message is displayed indicating the email is not registered

  Scenario: User attempts to sign in with an incorrect password
    Given the user navigates to the sign-in page
    When the user enters a valid email
    And enters an incorrect password
    And clicks the sign-in button
    Then an error message is displayed indicating the password is incorrect