import { User } from "../models/User";
import { Request, Response } from "express";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

interface IAuthRequest extends Request {
  user?: string;
}

export const generateToken = (id: string) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// Register user and sign in
export const register = async (req: IAuthRequest, res: Response) => {
  const { name, email, password } = req.body;

  //check if user exists
  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({ errors: ["Por favor, utilize outro e-mail."] });

    return;
  }

  // Generate password hash
  const salt = await bcrypt.genSalt(); //gera string aleatória
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  // If user was created successfully, return the token
  if (!newUser) {
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde."] });

    return;
  }

  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

// Sign user in
export const login = async (req: IAuthRequest, res: Response) => {
  const { email, password } = req.body;

  //check if user exists
  const user = await User.findOne({ email });

  //check if user exists
  if (!user) {
    res.status(422).json({ errors: ["Usuário não encontrado."] });
  }

  //check if password matches
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha inválida."] });
    return;
  }

  //Return user with token
  res.status(201).json({
    _id: user._id,
    token: generateToken(user._id),
  });
};

// Get current logged in user
export const getCurrentUser = async (req: IAuthRequest, res: Response) => {
  const userId = req.user; // Supondo que req.user contém o ID do usuário

  try {
    const user = await User.findById(userId).select("-password");

    // Verifica se o usuário existe
    if (!user) {
      res.status(404).json({ errors: ["Usuário não encontrado"] });
      return;
    }

    // Retorna o usuário com o campo isAdmin
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      cpf: user.cpf || null,
      birthDate: user.birthDate || null,
    });
  } catch (error) {
    res.status(404).json({ errors: ["Usuário não encontrado"] });
    return;
  }
};

//Get user by id
export const getUserById = async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");

    //check if user exists
    if (!user) {
      res.status(404).json({ errors: ["Usuário não encontrado"] });

      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ errors: ["Usuário não encontrado"] });

    return;
  }
};

export const changePassword = async (req: IAuthRequest, res: Response) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  try {
    // Verifica se o usuário está autenticado
    if (!req.user) {
      return res.status(401).json({ errors: ["Usuário não autenticado."] });
    }

    // Encontra o usuário no banco de dados com a senha
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado."] });
    }

    // Verifica se a senha atual está correta
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(422).json({ errors: ["Senha atual incorreta."] });
    }

    // Verifica se a nova senha e a confirmação são iguais
    if (newPassword !== confirmNewPassword) {
      return res
        .status(422)
        .json({ errors: ["As novas senhas não coincidem."] });
    }

    // Gera o hash da nova senha
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Atualiza a senha do usuário
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Senha alterada com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar a senha:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao processar a solicitação."] });
  }
};

export const updateUserInfo = async (req: IAuthRequest, res: Response) => {
  const { cpf, birthDate } = req.body;
  const userId = req.user;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado."] });
    }

    // Atualiza os dados opcionais
    if (cpf) user.cpf = cpf;
    if (birthDate) user.birthDate = new Date(birthDate);

    await user.save();

    return res.status(200).json({
      message: "Informações atualizadas com sucesso.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        cpf: user.cpf,
        birthDate: user.birthDate,
      },
    });
  } catch (error) {
    return res.status(500).json({ errors: ["Erro ao atualizar informações."] });
  }
};
