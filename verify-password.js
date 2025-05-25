const bcrypt = require('bcrypt');

const hashedPassword = "$2b$10$v2BGKJ.eYACuUGoT3jhSDOOgpcXC5pBjeW69FvRNUzIw/ZkRLeWpi";
const plainPassword = "Chimidem@sso";

bcrypt.compare(plainPassword, hashedPassword)
  .then(match => {
    console.log('Password matches:', match);
  })
  .catch(err => {
    console.error('Error comparing passwords:', err);
  }); 