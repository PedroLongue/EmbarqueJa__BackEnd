import { Request, Response } from "express";
import { TicketReservation } from "../models/ReservationTicket";
import { Tickets } from "../models/Tickets";
import { sendTicketEmailService } from "../services/email/sendTicketEmail";

export const createTicketReservation = async (req: Request, res: Response) => {
  const { userId, ticketId, seats } = req.body;

  if (!userId || !ticketId || !Array.isArray(seats) || seats.length === 0) {
    return res
      .status(400)
      .json({ message: "Campos obrigatórios ausentes ou inválidos." });
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

    const ticket = await Tickets.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Passagem não encontrada." });
    }

    const alreadyReserved = seats.some((seat: number) =>
      ticket.reservedSeats.includes(seat)
    );
    if (alreadyReserved) {
      return res
        .status(400)
        .json({ message: "Alguns assentos já estão reservados." });
    }

    const newReservation = new TicketReservation({
      userId,
      ticketId,
      seats,
      status: "pending",
    });
    await newReservation.save();

    ticket.reservedSeats.push(...seats);
    await ticket.save();

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
    const reservation = await TicketReservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reserva não encontrada." });
    }

    const ticket = await Tickets.findById(reservation.ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Passagem não encontrada." });
    }

    if (reservation.seats && reservation.seats.length > 0) {
      const seatsToRemove = reservation.seats.map((seat: number) =>
        Number(seat)
      );
      ticket.reservedSeats = ticket.reservedSeats
        .map((seat: number) => Number(seat))
        .filter((seat: number) => !seatsToRemove.includes(seat));

      ticket.markModified("reservedSeats");
      await ticket.save();
    }

    await TicketReservation.findByIdAndDelete(reservationId);

    res.json({
      message: "Reserva cancelada e assentos liberados com sucesso.",
      updatedReservedSeats: ticket.reservedSeats,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cancelar reserva.", error });
  }
};

export const sendTicketEmail = async (req: Request, res: Response) => {
  const { to, origin, destination, departureDate, departureTime, seats } =
    req.body;

  if (
    !to ||
    !origin ||
    !destination ||
    !departureDate ||
    !Array.isArray(seats)
  ) {
    return res
      .status(400)
      .json({ message: "Dados incompletos para envio do e-mail." });
  }

  try {
    await sendTicketEmailService(to, {
      origin,
      destination,
      departureDate,
      departureTime,
      seats,
    });
    res.status(200).json({ message: "E-mail enviado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao enviar e-mail.", error });
  }
};
