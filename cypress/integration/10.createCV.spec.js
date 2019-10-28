describe('Email login', () => {
    // beforeEach(() => {
    //     cy.visit('/');
    // })

    const testUserEmail = 'david@roombler.com';
    const testPassword = 'test123';
    var documentId = "";

    it('remove possible existing backpack', () => {
        cy.visit('/list');
        cy.get('.fa-bars').click();
        cy.contains('Delete').click();
        cy.wait(500);

        cy.visit('/list');
        cy.contains("Let's create your first backpack!");
    });


    it('can create first backpack', () => {
        cy.visit('/list');
        cy.url().should('include', '/list');

        cy.contains("Let's create your first backpack!");
        cy.contains('Create new backpack').click();


        cy.get('[name=value]').clear();
        cy.get('.btn-primary').contains('Create').click();
        cy.contains('Please enter something');

        cy.get('[name=value]').type('Test of Digital Backpack');
        cy.get('.btn-primary').contains('Create').click();

        cy.url().should('include', '/edit-document').then(() => {
            console.log("getting location", window.location);
            cy.location().should((loc) => {
                documentId = loc.toString().split('/').pop();
            });
        });
        cy.wait(500);
    });

    it('can add manual gig platform', () => {
        cy.visit('/edit-document/' + documentId);

        cy.get('.add-section-button').click();
        cy.wait(50);
        cy.get('#add-gigWork-button').click();
        cy.wait(50);
        cy.contains('Tiptapp', { timeout: 20000 }).click();
        cy.wait(50);
        cy.get('#edit-start-date').type('2019-04');
        cy.get('#edit-end-date').type('2019-08');
        cy.get('#edit-no-of-gigs').type('12');
        cy.get('.submit-button').click();
        cy.get('#skip-verification-button').click();
        cy.wait(100);
        cy.contains('Tiptapp');
        cy.get('.display-value-value').contains('12');
        cy.get('.date-container').contains('Apr 2019 - Aug 2019');
    });

    it('can add custom gig platform', () => {
        cy.visit('/edit-document/' + documentId);

        cy.get('#add-Gigs-button').click();
        cy.wait(50);
        cy.get('.add-custom-platform-button', { timeout: 20000 }).click();
        cy.wait(500);

        cy.get('#edit-organization-name').type('Test Platform');
        cy.get('#edit-organization-description').type('This is a custom platform, created by this test user.');
        cy.get('#edit-start-date').type('2018-01');
        cy.get('#edit-end-date').type('2018-12');
        cy.get('#edit-no-of-gigs').type('20');
        cy.get('.submit-button').click();
        cy.wait(100);
        cy.contains('Test Platform');
        cy.get('.display-value-value').contains('20');
        cy.get('.date-container').contains('Jan 2018 - Dec 2018');
    });

    it('can add profile data', () => {
        cy.visit('/edit-document/' + documentId);

        cy.contains('About me').click();
        cy.wait(500);
        cy.get('#edit-title').type('Game designer');
        cy.get('#edit-location').type('Vaxholm');
        cy.get('#edit-birthdate').type('1990-01-01');
        cy.get('#edit-summary').type(`I'm a nice guy who likes to do nice things. Like computer stuff an other nice stuff. Let's do nice stuff together`);
        cy.get('Button').contains('Save').click();
        cy.wait(100);
        cy.contains('Game designer');
        cy.contains('Vaxholm');
        cy.get('.age-text');
        cy.contains("I'm a nice guy who likes to do nice things");

    });

    it('can add education data', () => {
        cy.visit('/edit-document/' + documentId);

        cy.get('.add-section-button').click();
        cy.wait(50);
        cy.get('#add-educations-button').click();
        cy.wait(50);
        cy.get('#edit-organization-name').type('Stockholm University');
        cy.get('#edit-field-of-study').type('Film Art Science');
        cy.get('#edit-degree').select('SingleCourses');
        cy.get('#edit-start-date').type('1999-08-01');
        cy.get('#edit-end-date').type('2001-06-01');
        cy.get('#edit-summary').type('Inriktning på filmisk berättarteknik inom spelmediet.');
        cy.get('.submit-button').click();
        cy.wait(500);

        cy.contains('Stockholm University');
        cy.contains('Film Art Science');
        cy.contains('SingleCourses');
        cy.contains('Inriktning på filmisk');
    });

    it('can add employment data', () => {
        cy.visit('/edit-document/' + documentId);

        cy.get('.add-section-button').click();
        cy.wait(50);
        cy.get('#add-employments-button').click();
        cy.wait(50);
        cy.get('#edit-organization-name').type('Volvo AB');
        cy.get('#edit-title').type('Car Designer');
        cy.get('#edit-start-date').type('2018-08-01');
        cy.get('#edit-end-date').type('2019-06-01');
        cy.get('#edit-ongoing').check();
        cy.get('#edit-summary').type('Designade bilar, för det tycker jag är skoj.');
        cy.get('.submit-button').click();
        cy.wait(500);

        cy.contains('Volvo AB');
        cy.contains('Car Designer');
        cy.contains('Aug 2018 - Now');
        cy.contains('Designade bilar, för det tycker jag är skoj');
    });



});