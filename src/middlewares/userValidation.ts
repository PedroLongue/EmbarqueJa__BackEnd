const { body } = require("express-validator");

interface IValidatorOptions {
  req: {
    body: { password: string; newPassword: string; confirmNewPassword: string };
  };
}

export const userCreateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("O nome é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres."),
    body("email")
      .isString()
      .withMessage("O e-mail é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido."),
    body("password")
      .isString()
      .withMessage("A senha é obrigatória.")
      .isLength({ min: 5 })
      .withMessage("A senha precisa ter no mínimo 5 caracteres."),
    body("confirmPassword")
      .isString()
      .withMessage("A confirmação de senha é obrigatória.")
      .custom((value: string, { req }: IValidatorOptions) => {
        if (value != req.body.password) {
          throw new Error("As senhas não são iguais.");
        }
        return true;
      }),
  ];
};

export const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("O e-mail é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido."),
    body("password").isString().withMessage("A senha é obrigatória."),
  ];
};

export const changePasswordValidation = () => {
  return [
    body("currentPassword")
      .isString()
      .withMessage("A senha atual é obrigatória."),
    body("newPassword")
      .isString()
      .withMessage("A nova senha é obrigatória.")
      .isLength({ min: 5 })
      .withMessage("A nova senha precisa ter no mínimo 5 caracteres."),
    body("confirmNewPassword")
      .isString()
      .withMessage("A confirmação da nova senha é obrigatória.")
      .custom((value: string, { req }: IValidatorOptions) => {
        if (value !== req.body.newPassword) {
          throw new Error("As novas senhas não são iguais.");
        }
        return true;
      }),
  ];
};
