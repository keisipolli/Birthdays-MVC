import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('the user is on the {string} page', (birthdays) => {
    cy.visit(`${birthdays}`);
});

Then("the user should see a list of birthdays", () => {
    cy.get('li[class="birthday"]')

});