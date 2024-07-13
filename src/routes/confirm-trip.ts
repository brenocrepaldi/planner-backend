import dayjs from 'dayjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { getMailClient } from '../lib/mail';
import { prisma } from '../lib/prisma';
import { ClientError } from '../errors/client-error';
import { env } from '../env';

export async function confirmTrip(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/trips/:tripId/confirm',
		{
			schema: {
				params: z.object({
					tripId: z.string().uuid(),
				}),
			},
		},
		async (req, res) => {
			const { tripId } = req.params;

			const trip = await prisma.trip.findUnique({
				where: { id: tripId },
				include: {
					participants: {
						where: {
							is_owner: false,
						},
					},
				},
			});

			if (!trip) throw new ClientError('Trip not found.');

			if (trip.is_confirmed) return res.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);

			await prisma.trip.update({
				where: { id: tripId },
				data: { is_confirmed: true },
			});

			const formatedStartDate = dayjs(trip.starts_at).format('MMMM D, YYYY');
			const formatedEndDate = dayjs(trip.ends_at).format('MMMM D, YYYY');

			const mail = await getMailClient();

			await Promise.all(
				trip.participants.map(async (participant) => {
					const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;
					const message = await mail.sendMail({
						from: {
							name: 'Planner',
							address: 'planner@planner',
						},
						to: participant.email,
						subject: `Confirm your presence in the trip to ${trip.destination} on ${formatedStartDate}`,
						html: `
						<div style="font-family: sans-sefif; font-size: 16px; line-height: 1.6">
							<p>
								You were invited in a trip to <strong>${trip.destination}</strong> from
								<strong>${formatedStartDate}</strong> to <strong>${formatedEndDate}</strong>.
							</p>
							<p>To confirm your presence in the trip, click the link below:</p>
							<a href=${confirmationLink}>
								<p>Confirm presence</p>
							</a>
							<p>If you do not know what this email is about, just ignore this email.</p>
						</div>
					`.trim(),
					});

					console.log(nodemailer.getTestMessageUrl(message));
				})
			);

			return res.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);
		}
	);
}
