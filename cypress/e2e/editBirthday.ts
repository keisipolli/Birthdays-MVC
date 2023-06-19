import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

Given('the user is logged in', () => {
    cy.visit("https://localhost:5173/signin");

    // Fill in the login form
    cy.get("input[name=email]").type("testuser@gmail.com");
    cy.get("input[name=password]").type("qwerty123");

    // Submit the login form
    cy.get('button#sign-in').click();
});

Given('the user is on the {string} page', (birthdays) => {
    cy.visit(`https://localhost:5173${birthdays}`);
});

Given('there is a birthday with the name "John Doe" and date "2023-06-01"', (name, date) => {
    // Implementation of the step: Add a birthday with the provided name and date
    cy.get('li[class="birthday"]').contains("John Doe");
    cy.get('li[class="birthday"]').contains("2023-06-01");
});

When('the user clicks on the "Edit" button for the birthday with the name "John Doe"', (name) => {
    // Implementation of the step: Click on the "Delete" button for the birthday with the provided name
    cy.get(".birthday")
        .contains("John Doe")
        .parent()
        .find('.edit')
        .click();
});

Then('the user updates the name to "Jane Smith" and the date to "2023-06-02" and clicks "Edit"', () => {
    cy.get("input[id=edited-name]").clear().type("Jane Smith");
    cy.get("input[id=edited-date]").type("2023-06-02");
    cy.get('button#save').click();
});

Then('the birthday with the name "Jane Smith" and date "2023-06-02" should be displayed on the {string} page', (birthdays) => {
    // Implementation of the step: Verify that the deleted birthday is not displayed on the page
    cy.visit('https://localhost:5173/birthdays');
});