Feature: Edit Birthday

  Scenario: User edits a birthday
    Given the user is logged in
    And the user is on the "/birthdays" page
    And there is a birthday with the name "John Doe" and date "2023-06-01"
    When the user clicks on the "Edit" button for the birthday with the name "John Doe"
    And the user updates the name to "Jane Smith" and the date to "2023-06-02" and clicks "Edit"
    Then the birthday with the name "Jane Smith" and date "2023-06-02" should be displayed on the "/birthdays" page