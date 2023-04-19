/// <reference types="cypress" />

describe('template spec', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.login('test@gmail.com', 'test123');
  })

  it('Should add new boards', () => {
    cy.get('#new-board').should('be.visible').click();
  })
})
