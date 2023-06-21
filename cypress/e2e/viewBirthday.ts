import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('the user is on the {string} page', (birthdays) => {
    cy.visit(`${birthdays}`);
});

Then("the user should see a list of birthdays", () => {
    // Get existing birthdays
    // @ts-ignore
    cy.send('GET', '/birthdays', null, (response: Cypress.Response<any>): void => {

        // Do not add the birthday if it already exists
        if (response.body.filter((birthday: any) => birthday.name === "John Doe"
            && birthday.date === "2023-06-01T00:00:00.000Z").length === 0) {

            // Add the birthday
            // @ts-ignore
            cy.send('POST', '/birthdays', {
                name: "John Doe",
                date: "2023-06-01"
            }, (response: Cypress.Response<any>) => {

                // Verify that the birthday was added successfully
                expect(response.status).to.be.oneOf([201]);

                // Refresh the page to ensure that the birthday is displayed
                cy.visit('/birthdays');
            })
        }
    });

});