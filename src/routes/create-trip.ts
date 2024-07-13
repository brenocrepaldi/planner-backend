import dayjs from 'dayjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { getMailClient } from '../lib/mail';
import { prisma } from '../lib/prisma';
import { ClientError } from '../errors/client-error';

export async function createTrip(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/trips',
		{
			schema: {
				body: z.object({
					destination: z.string().min(4),
					starts_at: z.coerce.date(), // convert the value to a dateTime type
					ends_at: z.coerce.date(),
					owner_name: z.string(),
					owner_email: z.string().email(),
					emails_to_invite: z.array(z.string().email()),
				}),
			},
		},
		async (req) => {
			const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite } =
				req.body;

			if (dayjs(starts_at).isBefore(new Date())) throw new ClientError('Invalid trip start date.');
			if (dayjs(ends_at).isBefore(starts_at)) throw new ClientError('Invalid trip end date.');

			const trip = await prisma.trip.create({
				data: {
					destination: destination,
					starts_at: starts_at,
					ends_at: ends_at,
					participants: {
						createMany: {
							data: [
								{
									name: owner_name,
									email: owner_email,
									is_owner: true,
									is_confirmed: true,
								},
								...emails_to_invite.map((email) => {
									return { email };
								}),
							],
						},
					},
				},
			});

			const formatedStartDate = dayjs(starts_at).format('MMMM D, YYYY');
			const formatedEndDate = dayjs(ends_at).format('MMMM D, YYYY');

			const confirmationLink = `http://localhost:3333/trips/${trip.id}/confirm`;

			const mail = await getMailClient();

			const message = await mail.sendMail({
				from: {
					name: 'Planner',
					address: 'planner@planner',
				},
				to: {
					name: owner_name,
					address: owner_email,
				},
				subject: `Confirm your trip to ${destination} on ${formatedStartDate}`,
				html: `
					<div style="font-family: sans-sefif; font-size: 16px; line-height: 1.6">
						<p>
							You have requested to create a trip to <strong>${destination}</strong> from
							<strong>${formatedStartDate}</strong> to <strong>${formatedEndDate}</strong>.
						</p>
						<p>To confirm your trip, click the link below:</p>
						<a href=${confirmationLink}>
							<p>Confirm trip</p>
						</a>
						<p>If you do not know what this email is about, just ignore this email.</p>
					</div>
				`.trim(),
			});

			console.log(nodemailer.getTestMessageUrl(message));

			return {
				tripId: trip.id,
			};
		}
	);
}
