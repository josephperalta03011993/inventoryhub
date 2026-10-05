// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';
import { SignUpSchema, hashPassword } from '@/app/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Force the role to Employee for public self-registration to secure the environment
    const payloadData = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: 'Employee' // SECURE DEFAULT: Public signups can never choose Admin/Owner
    };

    const parsed = SignUpSchema.safeParse(payloadData);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid user registration input fields.' }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;

    // Check for existing records
    const existingUsers = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()} LIMIT 1`;
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'An account with this email address already exists.' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email.toLowerCase()}, ${hashedPassword}, ${role})
    `;

    return NextResponse.json({ message: 'Account provisioned successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Sign up route exception error:', error);
    return NextResponse.json({ error: 'Internal database connection failure.' }, { status: 500 });
  }
}
