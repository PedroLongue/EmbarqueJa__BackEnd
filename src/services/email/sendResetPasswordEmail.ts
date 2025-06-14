import { transporter } from "./transporter";

export const sendResetPasswordEmail = async (
  to: string,
  name: string,
  resetLink: string
) => {
  await transporter.sendMail({
    from: `"Equipe" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Redefinição de Senha",
    html: `
      <p>Olá, ${name || "usuário"}!</p>
      <p>Clique no botão abaixo para gerar uma nova senha segura:</p>
      <a href="${resetLink}" style="padding:10px 20px; background:#1976d2; color:white; text-decoration:none;">Gerar nova senha</a>
      <p>Este link expira em 30 minutos.</p>
    `,
  });
};

export const sendNewPasswordEmail = async (
  to: string,
  name: string,
  newPassword: string
) => {
  await transporter.sendMail({
    from: `"Equipe" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Sua nova senha",
    html: `
      <p>Olá, ${name || "usuário"}!</p>
      <p>Sua nova senha é: <strong>${newPassword}</strong></p>
      <p>Recomendamos alterá-la após o login.</p>
    `,
  });
};
