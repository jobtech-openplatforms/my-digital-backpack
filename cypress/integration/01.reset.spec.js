describe('Reset user data and login state', () => {
    // beforeEach(() => {
    //     cy.visit('/');
    // })

    const testUserEmail = 'david@roombler.com';
    const testPassword = 'test123';
    const testUserId = 'x47TvYbhBPUJO47zARVwmrEHpBG2';

    it('should reset user state', () => {
        cy.clearUser(testUserEmail, testPassword, testUserId);
        cy.visit('/');
        cy.url().should('include', '/new-user');
        cy.logout();
        cy.visit('/');
        cy.url().should('include', '/start');
    });

});