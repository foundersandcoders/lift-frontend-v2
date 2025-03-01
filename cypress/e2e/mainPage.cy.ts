describe('MainPage Component', () => {
  const testUsername = 'testuser123';
  
  beforeEach(() => {
    // Mock the useEntries hook response
    cy.intercept('GET', '/api/entries', {
      statusCode: 200,
      body: {
        data: {
          username: testUsername,
          entries: []
        }
      }
    }).as('getEntries');
    
    cy.mount(<MainPage />);
    cy.wait('@getEntries');
  });

  it('should display the main page container', () => {
    cy.get('main').should('exist');
    cy.get('main').should('have.class', 'min-h-screen');
  });

  it('should display the correct username in the header', () => {
    cy.get('h1')
      .should('contain.text', `Statement builder for ${testUsername}`)
      .and('have.class', 'text-3xl');
  });

  it('should render the StatementList component', () => {
    cy.get('.container').should('exist');
    cy.get('.container').should('have.class', 'mx-auto');
  });

  it('should have the correct background gradient', () => {
    cy.get('main')
      .should('have.class', 'bg-gradient-to-b')
      .and('have.class', 'from-gray-50')
      .and('have.class', 'to-gray-100');
  });
});
