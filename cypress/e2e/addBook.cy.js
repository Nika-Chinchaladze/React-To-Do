/// <reference types="Cypress" />

describe("addBook()", () => {
    it("should add new book", () => {
        // Arrange
        cy.visit("/");

        cy.intercept("POST", "http://localhost:5000/books", {
            statusCode: 201,
            body: {
              book: {
                _id: "4",
                title: "Game Of Thrones",
                author: "Ned Stark",
                image: "https://static.hbo.com/game-of-thrones-1-1920x1080.jpg",
                price: 100,
              },
            },
          }).as("postBook");
        
        // Act
        cy.get('[data-cy="title-input"]').click();
        cy.get('[data-cy="title-input"]').type("Game Of Thrones");

        cy.get('[data-cy="author-input"]').click();
        cy.get('[data-cy="author-input"]').type("Ned Stark");

        cy.get('[data-cy="image-input"]').click();
        cy.get('[data-cy="image-input"]').type("https://static.hbo.com/game-of-thrones-1-1920x1080.jpg");

        cy.get('[data-cy="price-input"]').click();
        cy.get('[data-cy="price-input"]').type("100");

        cy.get('[data-cy="submit-btn"]').click();
        
        // Assert
        cy.wait("@postBook").its("response.statusCode").should("eq", 201);
        cy.get('[data-cy="book-content"] li')
        .should("exist")
        .should("have.length", 1)
        .should("contain.text", "Game Of Thrones");
    });

    it("shouldn't add new book due to network error", () => {
      // Arrange & Mocking
      cy.intercept("GET", "http://localhost:5000/books", { fixture: "books.json" }).as("getBooks");
      cy.visit("/");
      cy.intercept("POST", "http://localhost:5000/books", { forceNetworkError: true }).as("postBook");
      // Act
      cy.get('[data-cy="title-input"]').click();
      cy.get('[data-cy="title-input"]').type("Game Of Thrones");

      cy.get('[data-cy="author-input"]').click();
      cy.get('[data-cy="author-input"]').type("Ned Stark");

      cy.get('[data-cy="image-input"]').click();
      cy.get('[data-cy="image-input"]').type("https://static.hbo.com/game-of-thrones-1-1920x1080.jpg");

      cy.get('[data-cy="price-input"]').click();
      cy.get('[data-cy="price-input"]').type("100");

      cy.get('[data-cy="submit-btn"]').click();
      // Assert
      cy.wait("@postBook").its("error").should("not.be.undefined");
      cy.get('[data-cy="book-content"] li').should("exist").should("have.length", 3);
    });
});
