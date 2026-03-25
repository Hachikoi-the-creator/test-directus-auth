// import { authOptions } from '@/lib/auth-options';
// import { getServerSession } from 'next-auth';
// import { redirect } from 'next/navigation';

// export default async function Home() {
//   const session = await getServerSession(authOptions);
//   if (
//     !session?.accessToken ||
//     session.error === 'RefreshAccessTokenError'
//   ) {
//     redirect('/login');
//   }
//   redirect('/follow-ups');
// }

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-start space-y-2 p-4">
      <h1 className="text-lg font-semibold mb-2">Hello World</h1>
      {/* <Link className="text-blue-600 underline" href="/follow-ups">Go to Follow Ups</Link> */}
      <Link className="text-blue-600 underline" href="/test-jsonb">Go to Test JSONB</Link>
    </div>
  );
}