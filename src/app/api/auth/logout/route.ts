import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Logout successful' 
      },
      { status: 200 }
    );

    // Delete all auth cookies
    response.cookies.delete('token');
    response.cookies.delete('user_email');
    response.cookies.delete('user_name');
    response.cookies.delete('user_id');
    response.cookies.delete('isAdmin');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Logout failed' 
      },
      { status: 500 }
    );
  }
}