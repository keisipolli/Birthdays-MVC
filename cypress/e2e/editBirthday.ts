import {Given, Then, When} from "@badeball/cypress-cucumber-preprocessor";

Given('the user is on the {string} page', (birthdays) => {
    cy.visit(`${birthdays}`);
});

Given('there is a birthday with the name "John Doe" and date "2023-06-01"', (name, date) => {

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
    cy.visit('/birthdays');
});
