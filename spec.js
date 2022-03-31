cy.wrap('something')
  .should('equal', 'something')
  .then(() => {
    cy.wrap({hello: 'world'}).its('hello').should('equal', 'world');
  });

const delayed = new Promise(resolve => {
	setTimeout(() => {
		resolve({foo: () => 'bar'});
	}, 1000);
});

cy.wrap(delayed)
  .invoke('foo')
  .should('be.equal', 'bar');

