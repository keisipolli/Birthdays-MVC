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

When('the user fills in the birthday form with name {string} and date {string}', (name, date) => {
    // Cypress code to fill in the birthday form
    cy.get('input[id="name"]').type("John Doe");
    cy.get('input[id="date"]').type("2023-06-01");
});

When('the user clicks the "Add Birthday" button', () => {
    // Cypress code to click the "Add Birthday" button
    cy.get('button[name="addbd"]').click();
});

Then('the birthday with name {string} and date {string} is successfully added', (name, date) => {
    // Cypress code to assert the successful addition of the birthday
    cy.get('li[class="birthday"]').contains(name);
    cy.get('li[class="birthday"]').contains(date);
});

Then('the added birthday is displayed on the page', () => {
    // Cypress code to assert the presence of the added birthday on the page
    cy.get('li[class="birthday"]').should('be.visible');
});