Feature: View Terms and Policies

  Scenario: User can access Terms and Policies page
    Given I am a user of BirthdayBook
    And I am on the Sign Up page
    When I click on the "Terms and Policies" link
    Then I should be redirected to the Terms and Policies page
    And I should see the Terms and Policies displayed in an organized and easy-to-understand manner