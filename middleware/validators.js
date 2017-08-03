
module.exports = {
  validEmail: (email) => {
    let emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    return emailRegex.test(email);
  },
  validString: (string) => {
    return string.trim() != '' && typeof string == 'string';
  },
  formatPhone: (phone) => {
  return phone.replace(/[^0-9]/g, "")
  }
};
