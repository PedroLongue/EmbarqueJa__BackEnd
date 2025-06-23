import { Request, Response } from "express";
import { PassengerFace } from "../models/PassengerFace";
import { Tickets } from "../models/Tickets";
import { User } from "../models/User";
import euclideanDistance from "../utils/euclideanDistance";

interface IAuthRequest extends Request {
  user?: string;
}

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadPassengerFace = async (
  req: MulterRequest,
  res: Response
) => {
  const { ticketId, name, cpf, descriptor } = req.body;

  if (!ticketId || !descriptor) {
    return res.status(400).json({ error: "Dados ou imagem ausentes." });
  }

  try {
    const passenger = await PassengerFace.create({
      ticketId,
      name,
      cpf,
      descriptor,
    });

    return res
      .status(201)
      .json({ message: "Imagem facial salva com sucesso", data: passenger });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao salvar imagem." });
  }
};

export const adminValidateFace = async (req: IAuthRequest, res: Response) => {
  const { descriptor } = req.body;

  if (!req.user || !descriptor) {
    return res.status(400).json({ error: "Dados incompletos." });
  }

  const admin = await User.findById(req.user);
  if (!admin?.isAdmin) {
    return res
      .status(403)
      .json({ error: "Apenas administradores têm acesso." });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  today.setHours(today.getHours() - 3);

  console.log("today", today);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const faces = await PassengerFace.find().populate("ticketId");

  for (const face of faces) {
    const ticket = face.ticketId as typeof Tickets & { departureDate?: Date };

    if (!ticket || !ticket.departureDate) {
      console.log(`[SKIP] ${face.name} não tem ticket válido.`);
      continue;
    }

    console.log(`[CHECK] ${face.name} - ${ticket.departureDate.toISOString()}`);

    if (ticket.departureDate < today || ticket.departureDate >= tomorrow) {
      console.log(`[SKIP] ${face.name} não tem viagem para hoje.`);
      continue;
    }

    const distance = euclideanDistance(face.descriptor, descriptor);

    if (distance < 0.6) {
      return res.status(200).json({
        name: face.name,
        cpf: face.cpf,
        company: ticket.company,
        departureTime: ticket.departureTime,
        origin: ticket.origin,
        destination: ticket.destination,
      });
    } else {
      console.log(`[NO MATCH] ${face.name} não corresponde ao descriptor`);
    }
  }

  return res
    .status(404)
    .json({ error: "Passageiro não reconhecido ou sem passagem ativa hoje." });
};
