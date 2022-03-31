cy.wrap("something")
  .should("equal", "something")
  .then(() => {
    cy.wrap({ foo: "bar" }).its("foo").should("equal", "bar");

    cy.wrap({ foo: { bar: "baz" } })
      .its("foo.bar")
      .should("equal", "baz");

    cy.wrap({ ham: { egg: "spam" } })
      .its("ham")
      .then(({ egg }) => {
        cy.wrap(egg).should("be.equal", "spam");
      });
  });

const delayed = new Promise((resolve) => {
  setTimeout(() => {
    resolve({ hello: () => "world" });
  }, 1000);
});

cy.wrap(delayed).invoke("hello").should("be.equal", "world");
