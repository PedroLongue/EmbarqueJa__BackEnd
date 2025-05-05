import { Server, Socket } from "socket.io";

const tempSeatSelections: Record<string, Record<number, string>> = {};
const seatTimeouts: Record<string, Record<number, NodeJS.Timeout>> = {};

export function socketHandler(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Usuário conectado:", socket.id);

    socket.on("join-ticket-room", (ticketId: string, userId: string) => {
      socket.join(ticketId);
      socket.data.userId = userId;
      console.log(
        `Usuário ${userId} (${socket.id}) entrou na sala ${ticketId}`
      );
    });

    socket.on("leave-ticket-room", (ticketId: string) => {
      socket.leave(ticketId);
      console.log(`Usuário ${socket.id} saiu da sala ${ticketId}`);
    });

    socket.on(
      "seat:temp-select",
      ({
        ticketId,
        seat,
        selected,
        userId,
      }: {
        ticketId: string;
        seat: number;
        selected: boolean;
        userId: string;
      }) => {
        if (!tempSeatSelections[ticketId]) tempSeatSelections[ticketId] = {};
        if (!seatTimeouts[ticketId]) seatTimeouts[ticketId] = {};

        if (selected) {
          tempSeatSelections[ticketId][seat] = userId;

          if (seatTimeouts[ticketId][seat]) {
            clearTimeout(seatTimeouts[ticketId][seat]);
          }

          seatTimeouts[ticketId][seat] = setTimeout(() => {
            if (tempSeatSelections[ticketId][seat] === userId) {
              delete tempSeatSelections[ticketId][seat];
              io.to(ticketId).emit("seats:update", {
                selections: tempSeatSelections[ticketId],
              });
              console.log(
                `Assento ${seat} liberado após timeout no ticket ${ticketId}`
              );
            }
          }, 5 * 60 * 1000);
        } else {
          if (tempSeatSelections[ticketId][seat] === userId) {
            delete tempSeatSelections[ticketId][seat];
          }
          if (seatTimeouts[ticketId][seat]) {
            clearTimeout(seatTimeouts[ticketId][seat]);
            delete seatTimeouts[ticketId][seat];
          }
        }

        io.to(ticketId).emit("seats:update", {
          selections: tempSeatSelections[ticketId],
        });

        console.log(
          `Usuário ${userId} ${
            selected ? "selecionou" : "desmarcou"
          } o assento ${seat} no ticket ${ticketId}`
        );
      }
    );

    socket.on("disconnect", () => {
      const userId = socket.data.userId;
      console.log("Usuário desconectado:", socket.id, userId);
      if (!userId) return;

      for (const ticketId in tempSeatSelections) {
        const seats = tempSeatSelections[ticketId];
        const timeouts = seatTimeouts[ticketId];

        for (const seat in seats) {
          if (seats[seat] === userId) {
            delete seats[seat];
            if (timeouts?.[seat]) {
              clearTimeout(timeouts[seat]);
              delete timeouts[seat];
            }
          }
        }

        io.to(ticketId).emit("seats:update", {
          selections: tempSeatSelections[ticketId],
        });
      }
    });
  });
}
