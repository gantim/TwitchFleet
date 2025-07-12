class Validate {
  validatePassName(username, password) {
    const errors = [];

    if (!username) {
      errors.push('Имя пользователя обязательно');
    } else {
      if (username.length <= 4 || username.length >= 32) {
        errors.push('Имя пользователя должно быть от 4 до 32 символов');
      }
      const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
      if (!usernameRegex.test(username)) {
        errors.push('Недопустимые символы в имени пользователя');
      }
    }

    if (!password) {
      errors.push('Пароль обязателен');
    } else {
      if (password.length < 6 || password.length > 64) {
        errors.push('Пароль должен быть от 6 до 64 символов');
      }
      const passwordRegex = /^(?=.*[а-яА-Яa-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?])/;
      if (!passwordRegex.test(password)) {
        errors.push('Пароль должен содержать буквы, цифры и спецсимвол');
      }
    }

    return errors;
  }
}

module.exports = new Validate();
