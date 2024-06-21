/// <reference types="Cypress" />

describe("removeBook()", () => {
    it("should delete book", () => {
        // Arrange & Mocking
        cy.intercept("GET", "http://localhost:5000/books", { fixture: "books.json" }).as("getBooks");
        cy.visit("/");
        cy.intercept("DELETE", "http://localhost:5000/books/3", {
            statusCode: 200,
            body: {
                message: "Book has been deleted successfully!",
            }
        }).as("deleteBook");

        // Assert before
        cy.get('[data-cy="book-content"] li').should("exist").should("have.length", 3);

        // Act
        cy.get('[data-cy="book-content"] li').last().as("lastBook");
        cy.get("@lastBook").find(".delete-btn").click();

        // Assert after
        cy.wait("@deleteBook").then((result) => {
            expect(result.response.statusCode).to.eq(200);
            expect(result.response.body.message).to.eq("Book has been deleted successfully!");
        })
        cy.get('[data-cy="book-content"] li').should("exist").should("have.length", 2);
    });
    
    it("should console log error message if network error occurs", () => {
        // Arrange & Mocking
        cy.intercept("GET", "http://localhost:5000/books", { fixture: "books.json" }).as("getBooks");
        cy.visit("/");
        cy.intercept("DELETE", "http://localhost:5000/books/3", { forceNetworkError: true }).as("deleteBook");
        // Act
        cy.get('[data-cy="book-content"] li').last().as("lastBook");
        cy.get("@lastBook").find(".delete-btn").click();
        // Assert
        cy.wait("@deleteBook").its("error").should("not.be.undefined");
    });
});
