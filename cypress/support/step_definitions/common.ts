import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";


Given(/^the user "([^"]*)" with password "([^"]*)" exists$/, function (user: string, password: string) :void {
    cy.request({
        method: 'POST',
        url: 'https://localhost:3000/users',
        body: {
            email: user,
            password: password
        },
        failOnStatusCode: false
    }).then((response: Cypress.Response<any>) :void => {
        expect(response.status).to.be.oneOf([201,409]);
    })
})

Given(/^the user "([^"]*)" with password "([^"]*)" is logged in$/, function (user: string, password: string) :void {
    cy.visit('/signin');

    cy.get('input[name="email"]').type(user);
    cy.get('input[name="password"]').type(password);

    cy.get('button#sign-in').click();

});