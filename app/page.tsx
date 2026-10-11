
import { redirect } from 'next/navigation';

export default function RootIndexPage() {
  // Automatically pass incoming traffic past the root block straight into your login interface
  redirect('/login');
}
