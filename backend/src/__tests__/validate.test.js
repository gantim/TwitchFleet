const validate = require('../middleware/validate');

describe('Валидация', () => {
  it('неверные символы → ошибки', () => {
    const errors = validate.validatePassName('имя с пробелом', 'Valid123!');
    expect(errors).toContain('Недопустимые символы в имени пользователя');
  });

  it('длина/формат → ошибки', () => {
    const errors = validate.validatePassName('abc', '123');
    expect(errors).toEqual(
      expect.arrayContaining([
        'Имя пользователя должно быть от 4 до 32 символов',
        'Пароль должен быть от 6 до 64 символов',
        'Пароль должен содержать буквы, цифры и спецсимвол',
      ])
    );
  });

  it('валидный логин → нет ошибок', () => {
    const errors = validate.validatePassName('ValidUser', 'GoodPass123!');
    expect(errors).toEqual([]);
  });
});
