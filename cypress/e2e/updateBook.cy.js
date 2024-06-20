/// <reference types="Cypress" />

describe("updateBook()", () => {
    it("should update last book successfully", () => {
        // Arrange
        cy.intercept("GET", "http://localhost:5000/books", { fixture: "books.json" }).as("getBooks");
        cy.visit("/");
        
        cy.intercept("PUT", "http://localhost:5000/books/3", { statusCode: 201 }).as("putBook");

        cy.intercept("GET", "http://localhost:5000/books/3", {
            body: {
                data: {
                    _id: "3",
                    title: "Keeps trying",
                    author: "Max Holloway",
                    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTugBHuGWykfPy5bxKD9xa-CBQu4Z95SVvSdA&usqp=CAU",
                    price: 13,
                }
            }
        }).as("getBookById");
        
        // Act
        cy.get('[data-cy="book-content"] li').last().as("lastBook");
        cy.get("@lastBook").find(".edit-btn").click();

        cy.get('[data-cy="author-input"]').click();
        cy.get('[data-cy="author-input"]').type("Max Holloway");

        cy.get('[data-cy="submit-btn"]').should("contain.text", "Update Book").click();

        // Assert
        cy.wait("@putBook").its("response.statusCode").should("eq", 201);
        cy.wait("@getBookById").its("response.body.data.author").should("eq", "Max Holloway");
        cy.get("@lastBook").should("contain.text", "Max Holloway");
    });
});
