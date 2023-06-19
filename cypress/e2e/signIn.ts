import {Given, Then, When} from "@badeball/cypress-cucumber-preprocessor";

Given('the user goes to the {string} page', (signin) => {
    cy.visit(`https://localhost:5173${signin}`);
});
When('the user enters a valid email and password',() => {
    // Fill in the login form
    cy.get("input[name=email]").type("testuser@gmail.com");
    cy.get("input[name=password]").type("qwerty123");

});
When('clicks the sign-in button', () => {
    // Submit the login form
    cy.get('button#sign-in').click();
});
Then('the user is redirected to the {string} page', (birthdays) => {
    cy.visit(`https://localhost:5173${birthdays}`);
});



Given('the user navigates to the {string} page', (signin) => {
    cy.visit(`https://localhost:5173${signin}`);
});
When('the user enters a valid email', () => {

    cy.get("input[name=email]").type("testuser@gmail.com");
});
When('enters an incorrect password', () => {
    cy.get("input[name=password]").type("qwerty1234");
});

Then('an error message is displayed indicating the password is incorrect', () => {
    cy.on('window:alert', (message) => {
        expect(message).to.match(/Invalid password/);
    });
});