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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const debugTestServiceName = 'testing';

Cypress.Commands.add('clearUser', (email, password, userId) => {
    cy.visit('/admin');
    cy.login(email, password);
    cy.contains('Delete user').click();
    cy.get('[name=value]').clear();
    cy.get('[name=value]').type(userId);
    cy.contains('Delete all data').click();
    cy.contains('User data deleted', { timeout: 20000 });
});

Cypress.Commands.add('logout', () => {
    console.log("command: logout")
    cy.get('.profile-button').click();
    cy.get('button').contains('Log out').click();

    // cy.window({ timeout: 10000 }).its(debugTestServiceName).then((testService) => {
    //  cy.get('.dropdown-item').click();
    //  cy.window().should(() => { testService.auth.isInited === true }).then(
    //     () => {
    //         testService.auth.logout();
    //     });
    //  cy.window().should(() => { testService.auth.currentUserId === '' });
    // });
});

Cypress.Commands.add('login', (email, password) => {
    cy.window({ timeout: 10000 }).its(debugTestServiceName).then((testService) => {
        console.log(testService.auth);
        const waitForAuthServiceBeforeLogin = (auth) => {
            if (auth.isAuthInited) {
                auth.loginPassword(email, password);
            } else {
                setTimeout(() => waitForAuthServiceBeforeLogin(auth), 100);
            }
        }
        waitForAuthServiceBeforeLogin(testService.auth);
    });
    cy.get('.profile-button');
});
