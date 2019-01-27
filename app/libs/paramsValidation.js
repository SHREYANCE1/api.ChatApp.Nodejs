/**
 * email validation
 */
let Email = (email) => {
    let emailRegex = '/^\w+([\.-]?\w+)*@\w+([\.-]?w+)*(\.\w{2,3})+$'
    if(email.match(emailRegex)){
        return true
    }else {
        return false
    }
}
/**
 * password validation
 */
let Password = (password) => {
    let passwordRegex = /^[A-Za-z0-9]\w{7,}$/
    if(password.match(passwordRegex)){
        return password
    }else {
        return false
    }
}

/**
 * exporting functions
 */
module.exports = {
    Email: Email,
    Password: Password
}