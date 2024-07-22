# Planner Backend

Welcome to the backend of the **Planner** project, a collaborative trip planning application. This backend is built using Fastify, Prisma, Zod, and other technologies. It provides endpoints for creating, confirming, and managing trips, participants, and activities.

## API Documentation

You can see the full documentation in the file [`docs/API.md`](docs/API.md).

## Technologies Used

- **Fastify**: A high-performance web framework with minimal overhead.
- **Prisma**: An ORM for seamless database interactions.
- **Zod**: A schema validation library.
- **Dayjs**: A library for date manipulation.
- **Nodemailer**: A library for sending emails.

## Available Endpoints

### Trips

- **Create Trip**: `POST /trips`
- **Confirm Trip**: `GET /trips/:tripId/confirm`
- **Get Trip Details**: `GET /trips/:tripId`
- **Update Trip**: `PUT /trips/:tripId`

### Participants

- **Confirm Participant**: `GET /participants/:participantEmail/confirm`
- **Get Participants**: `GET /participants`
- **Get Participant Details**: `GET /participants/:participantId`

### Activities

- **Create Activity**: `POST /trips/:tripId/activities`
- **Get Activities**: `GET /activities`

### Links

- **Create Link**: `POST /trips/:tripId/links`
- **Get Links**: `GET /links`

## Environment Configuration

Ensure you set up the environment variables in the `.env` file. Here’s an example configuration:

```env
DATABASE_URL="file:./dev.db"
API_BASE_URL="http://localhost:3333"
WEB_BASE_URL= "http://localhost:3000"
PORT=3333
```

### Installation and Running

1. **Clone the repository:**
   `git clone https://github.com/your-username/planner-backend.git
`
2. **Open the project:**
   ` cd planner-backend`

3. **Install dependencies:**
   `npm install`
   or
   `yarn install`
4. **Set up the database:**
   `
npx prisma migrate dev --name init`

5. **Start the server:**
   `npm run dev`
