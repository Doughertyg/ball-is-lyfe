const SAFE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;
const PASSWORD_RULES = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  number: /\d/,
  specialChar: /[^A-Za-z0-9]/
};
const PASSWORD_REQUIREMENTS_MESSAGE =
  `Password must be ${MIN_PASSWORD_LENGTH}-${MAX_PASSWORD_LENGTH} characters and include an uppercase letter, a lowercase letter, a number, and a special character.`;

const meetsPasswordRequirements = (password) =>
  password.length >= MIN_PASSWORD_LENGTH &&
  password.length <= MAX_PASSWORD_LENGTH &&
  PASSWORD_RULES.lowercase.test(password) &&
  PASSWORD_RULES.uppercase.test(password) &&
  PASSWORD_RULES.number.test(password) &&
  PASSWORD_RULES.specialChar.test(password);

module.exports.PASSWORD_REQUIREMENTS_MESSAGE = PASSWORD_REQUIREMENTS_MESSAGE;
module.exports.meetsPasswordRequirements = meetsPasswordRequirements;

module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }

  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else if (!SAFE_EMAIL_REGEX.test(email)) {
    errors.email = 'Email must be a valid email address';
  }

  if (password.trim() === '') {
    errors.password = 'Password must not be empty';
  } else if (!meetsPasswordRequirements(password)) {
    errors.password = PASSWORD_REQUIREMENTS_MESSAGE;
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}

module.exports.validateLoginInput = (email, password) => {
  const errors = {};

  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else if (!SAFE_EMAIL_REGEX.test(email)) {
    errors.email = 'Email must be a valid email address';
  }

  if (password.trim() === '') {
    errors.password = 'Password must not be empty';
  } else if (password.length > MAX_PASSWORD_LENGTH) {
    // Existing accounts may predate the complexity rules, so login only caps
    // length (also guards bcrypt.compare against oversized input) rather than
    // enforcing the full requirements retroactively.
    errors.password = `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer`;
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}
