import { headers } from 'next/headers';
import TablesClient from './TablesClient';

export default async function TablesManagementPage() {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${host}`;

  return <TablesClient baseUrl={baseUrl} />;
}
