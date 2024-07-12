import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import dayjs from 'dayjs';

export async function createActivity(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/trips/:tripId/activities',
		{
			schema: {
				params: z.object({
					tripId: z.string().uuid(),
				}),
				body: z.object({
					title: z.string().min(4),
					occurs_at: z.coerce.date(), // convert the value to a dateTime type
				}),
			},
		},
		async (req) => {
			const { tripId } = req.params;
			const { title, occurs_at } = req.body;

			const trip = await prisma.trip.findUnique({
				where: { id: tripId },
			});

			if (!trip) throw Error('Trip not found.');
			if (dayjs(occurs_at).isBefore(trip.starts_at)) throw Error('Invalid avtivity date.');
			if (dayjs(occurs_at).isAfter(trip.ends_at)) throw Error('Invalid avtivity date.');

			const activity = await prisma.activity.create({
				data: {
					title,
					occurs_at,
					trip_id: tripId,
				},
			});

			return { activityId: activity.id };
		}
	);
}
