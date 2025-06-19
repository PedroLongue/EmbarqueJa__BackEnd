import { User } from "../models/User";
import { Request, Response } from "express";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;
import crypto from "crypto";

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
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(422).json({ errors: ["As senhas não coincidem."] });
  }

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

    console.log("face-id: ", user.faceIdDescriptor);

    // Retorna o usuário com o campo isAdmin
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      cpf: user.cpf || null,
      birthDate: user.birthDate || null,
      userTickets: user.userTickets || [],
      faceIdDescriptor: !!user.faceIdDescriptor?.length,
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

export const userTicket = async (req: Request, res: Response) => {
  const { ticketId, paymentMethod, userSeats } = req.body;
  const { id: userId } = req.params;

  console.log(req.body);
  console.log(req.params);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado."] });
    }

    user.userTickets.push({
      ticketId,
      paymentMethod,
      userSeats,
    });

    await user.save();

    return res.status(200).json({
      message: "Viagem reservada com sucesso.",
      user: {
        _id: user._id,
        name: user.name,
        userTickets: user.userTickets,
      },
    });
  } catch (error) {
    return res.status(500).json({ errors: ["Erro ao atualizar informações."] });
  }
};

import euclideanDistance from "../utils/euclideanDistance";
import {
  sendNewPasswordEmail,
  sendResetPasswordEmail,
} from "../services/email/sendResetPasswordEmail";

export const registerFaceId = async (req: IAuthRequest, res: Response) => {
  const { descriptor } = req.body;

  if (!req.user || !descriptor) {
    return res.status(400).json({ errors: ["Dados inválidos."] });
  }

  try {
    const user = await User.findById(req.user);
    if (!user)
      return res.status(404).json({ errors: ["Usuário não encontrado."] });

    user.faceIdDescriptor = descriptor;
    await user.save();

    res.status(200).json({ message: "FaceID cadastrado com sucesso." });
  } catch (err) {
    res.status(500).json({ errors: ["Erro ao salvar FaceID."] });
  }
};

export const loginFaceId = async (req: Request, res: Response) => {
  const { descriptor } = req.body;
  if (!descriptor)
    return res.status(400).json({ errors: ["Descriptor ausente."] });

  const users = await User.find({ faceIdDescriptor: { $ne: null } });
  for (const user of users) {
    const distance = euclideanDistance(user.faceIdDescriptor, descriptor);
    if (distance < 0.6) {
      return res
        .status(200)
        .json({ _id: user._id, token: generateToken(user._id) });
    }
  }

  return res.status(401).json({ errors: ["Rosto não reconhecido."] });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ errors: ["E-mail obrigatório."] });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ errors: ["Usuário não encontrado."] });

    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    user.resetToken = token;
    user.resetTokenExpiration = expiration;
    await user.save();

    const resetLink = `https://embarqueja.xyz/api/users/confirm-reset?token=${token}`;

    await sendResetPasswordEmail(user.email, user.name, resetLink);

    return res
      .status(200)
      .json({ message: "E-mail com link de confirmação enviado." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errors: ["Erro ao enviar e-mail."] });
  }
};

export const confirmResetPassword = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ errors: ["Token inválido."] });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).send("Token inválido ou expirado.");
    }

    const novaSenha = crypto.randomBytes(4).toString("hex");
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(novaSenha, salt);

    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    await sendNewPasswordEmail(user.email, user.name, novaSenha);

    return res
      .status(200)
      .send("Nova senha enviada por e-mail. Você pode fechar esta página.");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errors: ["Erro ao redefinir senha."] });
  }
};
