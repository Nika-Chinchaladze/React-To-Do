/// <reference types="Cypress" />

describe("fetchBooks()", () => {
  
  it("should render page with mocked data", () => {
    // Arrange & Mocking
    cy.intercept("GET", "http://localhost:5000/books", { fixture: "books.json" }).as("getBooks");
    // Act
    cy.visit("/");
    // Assert
    cy.get('[data-cy="main-title"]').should("exist").should("contain.text", "Basic CRUD App With React");
    cy.get('[data-cy="form"]').should("exist");
    cy.get('[data-cy="form"] input').should("exist").should("have.length", 4);
    cy.get('button[type="submit"]').should("exist").should("contain.text", "Add New Book");
    cy.get('[data-cy="content-title"]').should("exist").should("contain.text", "Available Books");
    cy.get('[data-cy="book-content"] li').should("exist").should("have.length", 3);
  });

  it("should render page with 'No books available' paragraph if there isn't data in database", () => {
    // Arrange & Mocking
    cy.intercept("GET", "http://localhost:5000/books", {}).as("getBooks");
    // Act
    cy.visit("/");
    // Assert
    cy.get('[data-cy="main-title"]').should("exist").should("contain.text", "Basic CRUD App With React");
    cy.get('[data-cy="form"]').should("exist");
    cy.get('[data-cy="form"] input').should("exist").should("have.length", 4);
    cy.get('button[type="submit"]').should("exist").should("contain.text", "Add New Book");
    cy.get('[data-cy="content-title"]').should("exist").should("contain.text", "Available Books");
    cy.get('[data-cy="no-books"]').should("exist").should("contain.text", "No books available");
  });
  
  it("should render page and console log error message if data can't be accessed through database", () => {
    // Arrange & Mocking
    cy.intercept("GET", "http://localhost:5000/books", {forceNetworkError: true}).as("getBooks");
    // Act
    cy.visit("/");
    // Assert
    cy.get('[data-cy="main-title"]').should("exist").should("contain.text", "Basic CRUD App With React");
    cy.get('[data-cy="form"]').should("exist");
    cy.get('[data-cy="form"] input').should("exist").should("have.length", 4);
    cy.get('button[type="submit"]').should("exist").should("contain.text", "Add New Book");
    cy.get('[data-cy="content-title"]').should("exist").should("contain.text", "Available Books")
    cy.wait("@getBooks").its("error").should("not.be.undefined");
  });

})
