import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

Given('the user is on the {string} page', (birthdays: string): void => {
    cy.visit(`${birthdays}`);
});

When('the user fills in the birthday form with name {string} and date {string}', (name: string, date: string): void => {
    // Cypress code to fill in the birthday form
    cy.get('input[id="name"]').type(name);
    cy.get('input[id="date"]').type(date);
});

When('the user clicks the "Add Birthday" button', (): void => {
    // Cypress code to click the "Add Birthday" button
    cy.get('button[name="addbd"]').click();
});

Then('the birthday with name {string} and date {string} is successfully added', (name: string, date: string): void => {
    // Cypress code to assert the successful addition of the birthday
    cy.get('li.birthday').contains(name);
    cy.get('li.birthday').contains(date);
});

Then('the added birthday is displayed on the page', (): void => {
    // Cypress code to assert the presence of the added birthday on the page
    cy.get('li.birthday').should('be.visible');
});
