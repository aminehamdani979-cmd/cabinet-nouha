import { NextRequest, NextResponse } from 'next/server';

const USERNAME = 'aminehm1';
const PASSWORD = '@123456789@';

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader?.startsWith('Basic ')) {
    const base64Credentials = authHeader.slice(6);
    const credentials = atob(base64Credentials);
    const colonIndex = credentials.indexOf(':');
    const username = credentials.substring(0, colonIndex);
    const password = credentials.substring(colonIndex + 1);

    if (username === USERNAME && password === PASSWORD) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
