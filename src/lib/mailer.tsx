import nodemailer from "nodemailer";
import { env } from "@/config";
import { render } from "@react-email/render";
import VerifyEmail from "@/components/emails/VerifyEmail";
import PasswordResetEmail from "@/components/emails/PasswordResetEmail";

const globalForMailer = global as unknown as {
	mailer: nodemailer.Transporter;
};

const mailer =
	globalForMailer.mailer ||
	nodemailer.createTransport({
		host: env.SMTP_HOST,
		port: env.SMTP_PORT,
		secure: env.SMTP_SECURE,
		auth: {
			user: env.SMTP_USER,
			pass: env.SMTP_PASSWORD,
		},
	});

if (process.env.NODE_ENV !== "production") globalForMailer.mailer = mailer;

export async function sendVerificationEmailAction(email: string, name: string, url: string) {
	try {
		const emailHtml = await render(<VerifyEmail name={name} verificationUrl={url} appName={env.APP_NAME} />);

		mailer.sendMail({
			from: `"${env.APP_NAME}" <${env.SMTP_USER}>`,
			to: email,
			subject: `Verify your email - ${env.APP_NAME}`,
			html: emailHtml,
		});

		console.log(`Verification email sent to: ${email}`);
	} catch (error) {
		console.error("Failed to send verification email:", error);
	}
}

export async function sendResetPasswordEmailAction(email: string, name: string, url: string) {
	try {
		const emailHtml = await render(<PasswordResetEmail name={name} resetUrl={url} appName={env.APP_NAME} />);

		mailer.sendMail({
			from: `"${env.APP_NAME}" <${env.SMTP_USER}>`,
			to: email,
			subject: `Reset your password - ${env.APP_NAME}`,
			html: emailHtml,
		});

		console.log(`Reset password email sent to: ${email}`);
	} catch (error) {
		console.error("Failed to send reset password email:", error);
	}
}

export default mailer;
