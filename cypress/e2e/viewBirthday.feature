Feature: View Birthdays

  Scenario: User can view all birthdays on the birthdays page
    Given the user "testuser@gmail.com" with password "qwerty123" exists
    And the user "testuser@gmail.com" with password "qwerty123" is logged in
    And the user is on the "/birthdays" page
    Then the user should see a list of birthdays