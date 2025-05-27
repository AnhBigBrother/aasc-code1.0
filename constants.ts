const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;

const DATABASE_DIR = `${process.cwd()}/database.json` as const;

export { CLIENT_ID, CLIENT_SECRET, DATABASE_DIR };
