import dayjs from 'dayjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { getMailClient } from '../lib/mail';
import { prisma } from '../lib/prisma';

export async function createInvite(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/trips/:tripId/invites',
		{
			schema: {
				params: z.object({
					tripId: z.string().uuid(),
				}),
				body: z.object({
					email: z.string().email(),
				}),
			},
		},
		async (req) => {
			const { tripId } = req.params;
			const { email } = req.body;

			const trip = await prisma.trip.findUnique({
				where: { id: tripId },
			});

			if (!trip) throw Error('Trip not found.');

			const participant = await prisma.participant.create({
				data: {
					email,
					trip_id: tripId,
				},
			});

			const formatedStartDate = dayjs(trip.starts_at).format('MMMM D, YYYY');
			const formatedEndDate = dayjs(trip.ends_at).format('MMMM D, YYYY');

			const mail = await getMailClient();

			const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`;
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

			return { participantId: participant.id };
		}
	);
}
