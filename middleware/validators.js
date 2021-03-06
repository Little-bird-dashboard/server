
module.exports = {
  validEmail: (email) => {
    let emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    return emailRegex.test(email);
  },
  validString: (string) => {
    return string.trim() != '' && typeof string == 'string';
  },
  validGrade: (grade) => {
    let gradeRegex = /1-9K/;
    return gradeRegex.test(grade);
  },
  formatPhone: (phone) => {
  return phone.replace(/[^0-9]/g, "")
  },
  validSession: (token) => {
        jwt.verify(token, process.env.jwtKey, (err, decoded) => {
          if(err) {
            console.log('err', err)
            return false;
          } else {
            console.log('stakeholder_id', decoded)
            return true;
          }
      })
    }
};
