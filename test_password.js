console.log('Starting password comparison...');

const bcrypt = require('bcrypt');

const hash = '$2a$10$4xaZG0Vjg09McXjih0yg5.sK3h08pNs8jzb5Sa1INM3VQ0S.cu62e';
const candidatePassword = 'Chimidem@sso';

bcrypt.compare(candidatePassword, hash, (err, result) => {
  console.log('Inside bcrypt.compare callback');
  if (err) {
    console.error('Error comparing passwords:', err);
    return;
  }
  if (result) {
    console.log('Password is correct!');
  } else {
    console.log('Password is incorrect!');
  }
});

console.log('bcrypt.compare called, waiting for result...'); 