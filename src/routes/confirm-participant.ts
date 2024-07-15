import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { ClientError } from '../errors/client-error';
import { env } from '../env';

export async function confirmParticipant(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/participants/:participantEmail/confirm',
		{
			schema: {
				params: z.object({
					participantEmail: z.string().email(),
				}),
			},
		},
		async (req, res) => {
			const { participantEmail } = req.params;

			const participant = await prisma.participant.findUnique({
				where: {
					email: participantEmail,
				},
			});

			if (!participant) throw new ClientError('Participant not found.');

			if (participant.is_confirmed)
				return res.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`);

			await prisma.participant.update({
				where: {
					email: participantEmail,
				},
				data: {
					is_confirmed: true,
				},
			});

			return res.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`);
		}
	);
}
