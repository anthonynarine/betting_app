
export const validateEmail = (email) => {
    // Check if the email is empty or only contains whitespace
    if (!email.trim()) {
        return "Email is required.";
    }

    // Regex for email format validation
    const emailPattern = /^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(email)) {
        return "Invalid email format.";
    }

    return "";
};

export const validateSignupPassword = (password, password2) => {
    if (!password.trim() || !password2.trim()) {
        return "Password is required.";
    }

    if (password !== password2) {
        return "Passwords do not match.";
    }

    if (password.length < 6) {
        return "Password must be at least 6 characters long.";
    }

    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter.";
    }

    // if (!/[0-9]/.test(password)) {
    //     return "Password must contain at least one digit.";
    // }

    // Further checks can be added as needed

    return "";
};



/*  The username.trim() is used to ensure that the username
  is not just a sequence of whitespace characters. If after
  trimming the string it becomes empty, then the provided 
  username was either empty or only had whitespace characters, 
  and hence is considered invalid.

In simple terms, this check ensures that the user doesn't
enter just spaces (or other whitespace) as a valid username.*/