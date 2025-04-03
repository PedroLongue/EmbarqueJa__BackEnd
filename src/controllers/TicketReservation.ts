import { Request, Response } from "express";
import { TicketReservation } from "../models/ReservationTicket";

export const createTicketReservation = async (req: Request, res: Response) => {
  const { userId, ticketId } = req.body;

  if (!userId || !ticketId) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes." });
  }

  try {
    const existingReservation = await TicketReservation.findOne({
      userId,
      status: "pending",
    });

    if (existingReservation) {
      return res
        .status(409)
        .json({ message: "Usuário já tem uma reserva pendente." });
    }

    const newReservation = new TicketReservation({
      userId,
      ticketId,
      status: "pending",
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar reserva.", error });
  }
};

export const getPendingReservation = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const reservation = await TicketReservation.findOne({
      userId,
      status: "pending",
    });

    if (!reservation) {
      return res
        .status(404)
        .json({ message: "Nenhuma reserva pendente encontrada." });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar reserva.", error });
  }
};

export const confirmReservation = async (req: Request, res: Response) => {
  const { reservationId } = req.params;

  try {
    const updatedReservation = await TicketReservation.findByIdAndUpdate(
      reservationId,
      { status: "confirmed" },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reserva não encontrada." });
    }

    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: "Erro ao confirmar reserva.", error });
  }
};

export const cancelReservation = async (req: Request, res: Response) => {
  const { reservationId } = req.params;

  try {
    const deletedReservation = await TicketReservation.findByIdAndDelete(
      reservationId
    );

    if (!deletedReservation) {
      return res.status(404).json({ message: "Reserva não encontrada." });
    }

    res.json({ message: "Reserva cancelada com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cancelar reserva.", error });
  }
};
