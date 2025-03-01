import MainPage from '../../src/components/MainPage';

describe('MainPage Component', () => {
  const testUsername = 'testuser123';
  
  before(() => {
    // Handle WSL2 specific setup
    if (Cypress.platform === 'linux') {
      cy.log('Running in WSL2 environment');
      
      // Set up X server display
      cy.exec('wsl export DISPLAY=$(grep nameserver /etc/resolv.conf | awk \'{print $2}\'):0', {
        failOnNonZeroExit: false
      });
      
      // Verify X server connection
      cy.exec('wsl xdpyinfo', {
        failOnNonZeroExit: false
      }).then((result) => {
        if (result.code !== 0) {
          throw new Error('X server connection failed. Please ensure an X server is running on your Windows host.');
        }
      });
    }
  });

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
    
    // Add retry logic for mounting
    cy.mount(<MainPage />, {
      retryOnNetworkFailure: true,
      retryOnStatusCodeFailure: true,
      retryOnMountFailure: true
    });
    
    cy.wait('@getEntries', { timeout: 10000 });
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
