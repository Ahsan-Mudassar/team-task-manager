const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NO_TAGS = /^[^<>]*$/;

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

export const validateMemberEmail = (email) => validateEmail(email);

export const validateTeam = ({ name, description }) => {
    const errors = {};
    const n = name.trim();

    if (n.length < 2) errors.name = 'Team name must be at least 2 characters';
    else if (n.length > 100) errors.name = 'Team name must be 100 characters or less';
    else if (!NO_TAGS.test(n)) errors.name = 'Name must not contain < or >';

    if (description.length > 500) errors.description = 'Description must be 500 characters or less';
    else if (!NO_TAGS.test(description)) errors.description = 'Description must not contain < or >';

    return clean(errors);
};