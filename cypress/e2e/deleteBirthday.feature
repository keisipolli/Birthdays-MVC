Feature: Delete Birthday

  Scenario: User deletes a birthday
    Given the user is logged in
    And the user is on the "/birthdays" page
    And there is a birthday with the name "John Doe" and date "2023-06-01"
    And the user clicks on the "Delete" button for the birthday with the name "John Doe"
    Then the deleted birthday should not be displayed on the "/birthdays" page