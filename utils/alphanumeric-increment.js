'use strict';

module.exports = {
  // This module will increment alphanumeric counters using 0-9 and a-Z 
  // For example next('a9') => 'aa'
  // return null for invalid input
  next: function next(input) {
    // lookups for borders of obvious charcode increments
    const borders = {
      57: 97,
      122: 65,
      90: 48
    }
    
    // return a starting counter if input is falsey
    if (!input) {
      return '1';
    }
    // return null if input is otherwise invalid
    if (typeof input !== 'string' || input.match(/[^a-zA-Z0-9]/)) {
      return null;
    }
    // incriment and return
    let next = input.split('');
    for (let i = input.length - 1; i >= 0; i--) {
      let charCode = next[i].charCodeAt(0);
      let nextChar;
      // is char on a border or not?
      if (borders.hasOwnProperty(charCode)) {
        nextChar = borders[charCode];
      } else {
        nextChar = charCode + 1;
      }
      
      next[i] = String.fromCharCode(nextChar);
      
      // can we return or do we increment the next character as well?
      if (charCode !== 90) {
        return next.join('');
      } else if (i === 0) {
        // Add character if needed
        next.unshift('0');
        return next.join('');
      }
    }
  },
  last: function last(input) {
    
  }
};