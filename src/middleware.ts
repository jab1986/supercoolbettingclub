import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Create Supabase server client
  const requestHeaders = new Headers(request.headers);
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          requestHeaders.set('Set-Cookie', `${name}=${value}; Max-Age=${options.maxAge}; Path=/`);
        },
        remove(name: string, options: any) {
          requestHeaders.set('Set-Cookie', `${name}=; Max-Age=0; Path=/`);
        }
      }
    }
  );
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();

  // If accessing admin pages without auth, redirect to login
  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to the admin login page
    if (request.nextUrl.pathname === '/admin') {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
    
    // Redirect to login for other admin paths
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  // Rate limit middleware setup for API routes
  if (request.nextUrl.pathname.startsWith('/api/update')) {
    // Get client IP address from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    
    // This is where you would implement rate limiting logic
    // For simplicity, we're just checking for authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }
  }
  
  // For all other routes, continue
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Run middleware on admin and API routes
export const config = {
  matcher: ['/admin/:path*', '/api/update'],
}; 