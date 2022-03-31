cy.wrap("something")
  .should("equal", "something")
  .then(() => {
    cy.wrap({ foo: { bar: "baz" } })
      .its("foo.bar")
      .should("equal", "baz");
  });

const delayed = new Promise((resolve) => {
  setTimeout(() => {
    resolve({ foo: () => "bar" });
  }, 1000);
});

cy.wrap(delayed).invoke("foo").should("be.equal", "bar");
