Feature: View Birthdays

  Scenario: User can view all birthdays on the birthdays page
    Given the user is logged in
    And the user is on the "/birthdays" page
    Then the user should see a list of birthdays