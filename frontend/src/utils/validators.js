const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => (
    EMAIL_RE.test(email.trim()) ? undefined : 'Please enter a valid email address'
);

export const validateLogin = ({ email, password }) => {
    const errors = { email: validateEmail(email) };
    if (!password) errors.password = 'Password is required';
    return clean(errors);
};

export const validateRegister = ({ name, email, password }) => {
    const errors = { email: validateEmail(email) };

    if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        errors.password = 'Password must contain letters and numbers';
    }

    return clean(errors);
};

const clean = (errors) => Object.fromEntries(
    Object.entries(errors).filter(([, v]) => v)
);