import QRCode from "qrcode";
import { transporter } from "./transporter";

export const sendTicketEmailService = async (
  to: string,
  ticketInfo: {
    origin: string;
    destination: string;
    departureDate: string;
    departureTime: string;
    seats: number[];
    passangers: {
      name: string;
      cpf: string;
    }[];
  }
) => {
  const queryParams = new URLSearchParams({
    origin: ticketInfo.origin,
    destination: ticketInfo.destination,
    departureDate: ticketInfo.departureDate,
    departureTime: ticketInfo.departureTime,
    seats: ticketInfo.seats.join(","),
    passengers: JSON.stringify(ticketInfo.passangers),
  });

  const qrData = `http://embarqueja.xyz/validate-from-qr-code?${queryParams.toString()}`;

  const qrCodeBase64 = await QRCode.toDataURL(qrData);
  const qrCodeBuffer = Buffer.from(
    qrCodeBase64.replace(/^data:image\/png;base64,/, ""),
    "base64"
  );

  await transporter.sendMail({
    from: `"EmbarqueJá" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Sua passagem está confirmada!",
    html: `
      <h2>Obrigado por comprar com a EmbarqueJá!</h2>
      <p><strong>Origem:</strong> ${ticketInfo.origin}</p>
      <p><strong>Destino:</strong> ${ticketInfo.destination}</p>
      <p><strong>Data:</strong> ${new Intl.DateTimeFormat("pt-BR").format(
        new Date(ticketInfo.departureDate)
      )} | ${ticketInfo.departureTime}</p>
      <p><strong>Passageiro(s):</strong></p>
      <ul>
        ${ticketInfo.passangers
          .map((p) => `<li>${p.name} - CPF: ${p.cpf}</li>`)
          .join("")}
      </ul>
      <br/>
      <p><strong>Assento(s):</strong> ${ticketInfo.seats.join(", ")}</p>
      <br/>
      <p>Apresente o QR Code abaixo no embarque:</p>
      <img src="cid:qrcodeimg" alt="QR Code da passagem" width="200"/>
    `,
    attachments: [
      {
        filename: "qrcode.png",
        content: qrCodeBuffer,
        cid: "qrcodeimg",
      },
    ],
  });
};
