import { NextResponse } from 'next/server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing business email or system password credentials.' }, { status: 400 });
    }

   
    await signIn('credentials', {
      email: email.toLowerCase(),
      password: password,
      redirect: false, // Prevents server-side redirect loops so your custom timeout handles transitions
    });

    return NextResponse.json({ success: true, message: 'Authorized! Session cookie successfully committed.' });

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return NextResponse.json({ error: 'Invalid business email or system password configuration.' }, { status: 401 });
        default:
          return NextResponse.json({ error: 'Authorization clearance denied.' }, { status: 401 });
      }
    }

    console.error('Login router endpoint error:', error);
    return NextResponse.json({ error: 'Internal system server failure' }, { status: 500 });
  }
}
