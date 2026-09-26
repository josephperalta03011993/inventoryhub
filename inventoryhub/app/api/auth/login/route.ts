import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';
import { LoginSchema, hashPassword, signSessionToken } from '@/app/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();


    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please provide a valid business email address format matrix.' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;


    const users = await sql`
      SELECT id, name, email, password, role FROM users 
      WHERE email = ${email.toLowerCase()} LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'No authorized system clearance record found with these credentials.' },
        { status: 401 }
      );
    }

    const userRecord = users[0];

   
    const incomingHashedPassword = await hashPassword(password);

    if (incomingHashedPassword !== userRecord.password) {
      return NextResponse.json(
        { error: 'Invalid system verification password provided.' },
        { status: 401 }
      );
    }

   
    const sessionTokenToken = await signSessionToken({
      id: String(userRecord.id),
      email: userRecord.email,
      role: userRecord.role as 'Employee' | 'Admin' | 'Owner',
    });

        const response = NextResponse.json({ message: 'Authentication verified.' }, { status: 200 });
    
    response.cookies.set('inventory_session', sessionTokenToken, {
      httpOnly: true, // Safeguards against cross-site scripting (XSS) client attacks
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2, // 2-hour duration expiration lifetime limit matching utils
    });

    return response;

  } catch (error) {
    console.error('Login router endpoint exception:', error);
    return NextResponse.json(
      { error: 'An unexpected database lookup failure occurred.' },
      { status: 500 }
    );
  }
}
