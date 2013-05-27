describe('util', function() {
  it('can get elements from the dom', function() {
      var d = document.createElement('div');
      d.id = 'test-div';
      document.body.appendChild(d);
      expect(wax.u.$('test-div')).toEqual(d);
      d.parentNode.removeChild(d);
  });
});
