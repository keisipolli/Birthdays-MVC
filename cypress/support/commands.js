// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Send a GET Request and run callback function
Cypress.Commands.add('send', (method, url, body, callback) => {

    // Get backend base url from cypress.config.ts
    const baseUrl = Cypress.env('VITE_API_BASE_URL')

    // Options for GET Request
    const options = {
        method: method,
        url: baseUrl + url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }

    // Add body to options
    if (body) {
        options.body = body
    }

    // Check if local storage has a token
    if (localStorage.getItem('sessionId')) {

        // Add token to headers
        options.headers['Authorization'] = localStorage.getItem('sessionId')
    }

    // Send GET Request
    cy.request(options).then((response) => {
            // Run callback function
            callback(response)
    })
})


