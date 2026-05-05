import { Client, Databases, Query } from 'node-appwrite';

const client = new Client();

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

export const databases = new Databases(client);

export const DB_ID = process.env.APPWRITE_DATABASE_ID || 'byok_db';

export const COLLECTIONS = {
  API_KEYS: 'api_keys',
  REQUEST_LOGS: 'request_logs',
  GATEWAY_KEYS: 'gateway_keys',
};

export { Query };
