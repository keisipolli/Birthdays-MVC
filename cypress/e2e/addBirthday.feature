Feature: Add Birthday

  Scenario: User adds a birthday
    Given the user "testuser@gmail.com" with password "qwerty123" exists
    And the user "testuser@gmail.com" with password "qwerty123" is logged in
    And the user is on the "/birthdays" page
    When the user fills in the birthday form with name "John Doe" and date "2023-06-01"
    And the user clicks the "Add Birthday" button
    Then the birthday with name "John Doe" and date "2023-06-01" is successfully added
    And the added birthday is displayed on the page