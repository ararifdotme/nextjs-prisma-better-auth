import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Tailwind, Text } from "@react-email/components";

type PasswordResetEmailProps = {
	name?: string;
	resetUrl: string;
	appName?: string;
};

export default function PasswordResetEmail({ name = "there", resetUrl, appName = "Your App" }: PasswordResetEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Reset your password for {appName}.</Preview>
			<Tailwind>
				<Body className="m-0 bg-slate-100 px-3 py-6 font-sans">
					<Container className="mx-auto max-w-140">
						<Section className="rounded-[14px] border border-slate-200 bg-white p-7">
							<Text className="m-0 mb-2.5 text-xs font-bold uppercase tracking-[0.08em] text-indigo-500">{appName}</Text>
							<Heading className="m-0 mb-4 text-[28px] font-bold leading-8.5 text-slate-900">Reset your password</Heading>
							<Text className="m-0 mb-3.5 text-[15px] leading-6 text-slate-700">Hi {name},</Text>
							<Text className="m-0 mb-3.5 text-[15px] leading-6 text-slate-700">
								We received a request to reset your password. Use the button below to set a new password.
							</Text>

							<Section className="my-6 text-left">
								<Button href={resetUrl} className="rounded-[10px] bg-indigo-600 px-5 py-3 text-sm font-semibold text-white no-underline">
									Reset password
								</Button>
							</Section>

							<Text className="m-0 text-[13px] leading-5 text-slate-500">
								If you didn&apos;t request this, you can safely ignore this email.
							</Text>

							<Hr className="my-5 border-slate-200" />

							<Text className="m-0 mb-2 text-[13px] leading-5 text-slate-500">Button not working? Copy and paste this link into your browser:</Text>
							<Link href={resetUrl} className="break-all text-[13px] text-indigo-700">
								{resetUrl}
							</Link>
						</Section>

						<Text className="m-0 mt-3.5 text-center text-xs text-slate-400">
							© {new Date().getFullYear()} {appName}. All rights reserved.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

PasswordResetEmail.PreviewProps = {
  name: "John Doe",
  resetUrl: "http://localhost:3000/reset?token=abc123",
  appName: "Next.js Prisma Boilerplate",
}