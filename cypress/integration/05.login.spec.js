describe('Email login', () => {
    // beforeEach(() => {
    //     cy.visit('/');
    // })

    const testUserEmail = 'david@roombler.com';
    const testPassword = 'test123';

    it('should logout if logged in', () => {
        cy.visit('/list');
        cy.logout();
    });

    it('should redirect to login when not logged in', () => {
        cy.visit('/list');
        cy.url().should('include', '/start');

        cy.visit('/new-user');
        cy.url().should('include', '/start');

        cy.visit('/edit-profile');
        cy.url().should('include', '/start');

        cy.visit('/edit-document/fakeddocumentid');
        cy.url().should('include', '/start');
    });

    it('has correct heading', () => {
        cy.visit('/');
        cy.contains('Login/Create account');
    });

    it('needs email to sign-in with email', () => {
        cy.visit('/');
        cy.get('.email-login-button').click();
        cy.get('.error').contains('Not valid email adress'); //TODO: check for invalis class
    });

    it('needs valid email to sign-in with email', () => {
        cy.visit('/');
        cy.get('[type=email]').type('invalid');
        cy.get('.email-login-button').click();
        cy.get('.error').contains('Not valid email adress'); //TODO: check for invalis class
    });

    it('needs password to sign in', () => {
        cy.visit('/');
        cy.get('[type=email]').type(testUserEmail);
        cy.get('.email-login-button').click();
        cy.get('.error').contains('You need to supply a password'); //TODO: check for invalis class
    });

    it('needs correct password to sign in', () => {
        cy.visit('/');
        cy.get('[type=email]').type(testUserEmail);
        cy.get('[type=password]').type('incorrect');
        cy.get('.email-login-button').click();
        cy.get('.error').contains('Login failed: The password is invalid or the user does not have a password.'); //TODO: check for invalis class

    });

    // test creating new account
    // test creating existing account
    // test reset password

    it('should go to new user/invite page when logged in with new user', () => {
        cy.visit('/');
        cy.get('[type=email]').type(testUserEmail);
        cy.get('[type=password]').type(testPassword);
        cy.get('.email-login-button').click();

        cy.url().should('include', '/new-user');
    });

    it('should require invite from new users', () => {
        cy.visit('/');
        cy.url().should('include', '/new-user');
        cy.contains('You need an invite');
        // test empty invite code
        cy.get('[name=invitecode]').type('testbackpack');
        cy.get('.submit-button').click();
        cy.contains('Welcome');
    });

    it('should go to profile page after invite is accepted', () => {
        cy.url().should('include', '/new-user');
        cy.contains('Welcome');
    });

    it('should not allow incorrect profile entries', () => {
        cy.get('[name=name]').clear();
        cy.get('.submit-button').click();
        cy.get('.alert').contains('Name is required.');
        // test file upload
    });

    it('should go to list when profile is saved', () => {
        cy.get('[name=name]').clear();
        cy.get('[name=name]').type('David Testare');
        cy.get('.submit-button').click();
        cy.url().should('include', '/list');
    });

    it('should redirect to list when profile complete', () => {
        cy.visit('/');
        cy.url().should('include', '/list');
    });


});