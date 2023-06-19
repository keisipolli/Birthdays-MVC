import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("the user is logged in", () => {
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

Then("the user should see a list of birthdays", () => {
    cy.get('li[class="birthday"]')

});