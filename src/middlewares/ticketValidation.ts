const { body } = require("express-validator");

export const ticketValidation = () => {
  return [
    body("origin")
      .isString()
      .withMessage("A origem é obrigatória.")
      .isLength({ min: 3 })
      .withMessage("A origem precisa ter no mínimo 3 caracteres."),

    body("destination")
      .isString()
      .withMessage("O destino é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O destino precisa ter no mínimo 3 caracteres."),

    body("departureDate")
      .isISO8601()
      .withMessage("A data de partida deve estar no formato AAAA-MM-DD."),

    body("departureTime")
      .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("O horário de partida deve estar no formato HH:mm."),

    body("arrivalTime")
      .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("O horário de chegada deve estar no formato HH:mm."),

    body("type")
      .isString()
      .withMessage("O tipo de passagem é obrigatório.")
      .isIn(["Convencional", "Leito", "Semi-Leito", "Executivo", "Leito-cama"])
      .withMessage("O tipo deve ser 'Convencional', 'Leito' ou 'Semi-Leito'."),

    body("amenities")
      .isArray()
      .withMessage("As comodidades devem ser um array de strings."),

    body("company").isString().withMessage("O nome da empresa é obrigatório."),

    body("companyLogo")
      .isString()
      .withMessage("A logo da empresa é obrigatória.")
      .isURL()
      .withMessage("A logo da empresa deve ser uma URL válida."),

    body("price")
      .isFloat({ min: 0 })
      .withMessage("O preço deve ser um número maior ou igual a zero."),
  ];
};

export const updateUserValidation = () => {
  return [
    body("cpf")
      .optional()
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
      .withMessage("Insira um CPF válido no formato XXX.XXX.XXX-XX."),

    body("birthDate")
      .optional()
      .matches(/^\d{2}\/\d{2}\/\d{4}$/)
      .withMessage(
        "Insira uma data de nascimento válida no formato DD/MM/YYYY."
      )
      .customSanitizer((value: string) => {
        const [day, month, year] = value.split("/");
        return `${year}-${month}-${day}`;
      })
      .custom((value: string) => {
        console.log(value);
        const date = new Date(value);
        const [year, month, day] = value.split("-").map(Number);

        const isValid =
          date.getFullYear() == year &&
          date.getMonth() + 1 == month &&
          date.getDate() + 1 == day;

        if (!isValid) {
          throw new Error("Data de nascimento inválida.");
        }

        return true;
      }),
  ];
};
