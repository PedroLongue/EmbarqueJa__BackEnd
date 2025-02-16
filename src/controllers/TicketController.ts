import { Tickets } from "../models/Tickets";
import { Request, Response } from "express";

export const createTicket = async (req: Request, res: Response) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      departureTime,
      arrivalTime,
      type,
      amenities,
      company,
      companyLogo,
      price,
    } = req.body;

    const newTicket = await Tickets.create({
      origin,
      destination,
      departureDate,
      departureTime,
      arrivalTime,
      type,
      amenities,
      company,
      companyLogo,
      price,
    });

    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ errors: ["Erro ao criar passagem."] });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Tickets.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ errors: ["Erro ao buscar passagens."] });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ticket = await Tickets.findById(id);

    if (!ticket) {
      res.status(404).json({ errors: ["Passagem não encontrada."] });
      return;
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(404).json({ errors: ["Passagem não encontrada."] });
  }
};
