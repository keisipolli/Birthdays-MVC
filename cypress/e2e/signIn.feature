Feature: Sign in to BirthdayBook App

  Scenario: User successfully signs in with valid email and password
    Given the user goes to the "/signin" page
    When the user enters a valid email and password
    And clicks the sign-in button
    Then the user is redirected to the "/birthdays" page

  Scenario: User attempts to sign in with an incorrect password
    Given the user navigates to the "/signin" page
    When the user enters a valid email
    And enters an incorrect password
    And clicks the sign-in button
    Then an error message is displayed indicating the password is incorrect