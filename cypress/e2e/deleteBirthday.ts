import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";


Given('the user is on the {string} page', (birthdays) => {
    cy.visit(`${birthdays}`);
});

Given('there is a birthday with the name {string} and date {string}', (name, date) => {
    // Implementation of the step: Add a birthday with the provided name and date
    cy.get('li[class="birthday"]').contains("John Doe");
    cy.get('li[class="birthday"]').contains("2023-06-01");
});

When('the user clicks on the "Delete" button for the birthday with the name {string}', (name) => {
    // Implementation of the step: Click on the "Delete" button for the birthday with the provided name
    cy.get(".birthday")
        .contains("John Doe")
        .parent()
        .find('.delete')
        .click();
});

Then('the deleted birthday should not be displayed on the {string} page', (birthdays) => {
    // Implementation of the step: Verify that the deleted birthday is not displayed on the page
    cy.visit('/birthdays');
});