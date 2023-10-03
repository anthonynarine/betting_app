// validators.js

/**
 * Validates the provided username.
 *
 * @param {string} username - The username to validate.
 * @returns {string} - Returns an error message if the username is invalid, 
 *                     otherwise returns an empty string.
 */
export const validateUsername = (username) => {
    // Check if the username is empty or only contains whitespace
    if (!username.trim()) {
      return "Username is required.";
    }
    return "";
  };
  
  /**
   * Validates the provided password.
   *
   * @param {string} password - The password to validate.
   * @returns {string} - Returns an error message if the password is invalid,
   *                     otherwise returns an empty string.
   */
  export const validatePasswordLogin = (password) => {
    // Check if the password is empty or only contains whitespace
    if (!password.trim()) {
      return "Password is required.";
    }
    return "";
  };




/*  The username.trim() is used to ensure that the username
  is not just a sequence of whitespace characters. If after
  trimming the string it becomes empty, then the provided 
  username was either empty or only had whitespace characters, 
  and hence is considered invalid.

In simple terms, this check ensures that the user doesn't
enter just spaces (or other whitespace) as a valid username.*/