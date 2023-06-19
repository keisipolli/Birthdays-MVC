import {Given, Then, When} from "@badeball/cypress-cucumber-preprocessor";

Cypress.on('uncaught:exception', () => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

let email = ''
Given('the user navigates to the sign-up page',() => {
    cy.visit("https://localhost:5173/signup");
});
When('the user enters a valid email and password',() => {

    // Generate a random email
    email = Math.random().toString(36).substring(2) + "@asd.ee";

    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type("qwerty123");
});
When('clicks the sign-up button',() => {
    cy.get('button#sign-up').click();
});
Then('the user is redirected to the sign-in page',() => {
    // Check that the user is redirected to the sign-in page
    cy.url().should("include", "/signin");
});


When('the user enters an email that is already registered',() => {
    cy.get("input[name=email]").type("testuser@gmail.com");

});
When('enters a valid password',() => {
    cy.get("input[name=password]").type("123456789");
});
Then('an error message is displayed indicating the email is already registered',() => {
    cy.get("#email-error").should("contain", "Email already exists");
});


When('the user enters a valid email',() => {

    // Generate a new random email
    let email2 = Math.random().toString(36).substring(2) + "@asd.ee";
    cy.get("input[name=email]").type(email2);
});
When('enters an incorrect password and clicks the sign-up button',() => {
    cy.get("input[name=password]").type("qwerty");
});
Then('an error message is displayed indicating the password requirements are not met',() => {
    cy.get("#password-error").should("contain", "Password must be at least 8 characters long");
});