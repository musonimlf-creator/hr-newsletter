import { NextRequest, NextResponse } from 'next/server';

// Accepts: { passcode: string }
export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    
    if (!passcode) {
      return NextResponse.json({ valid: false, error: 'Passcode is required' }, { status: 400 });
    }

    const adminPasscode = process.env.ADMIN_PASSCODE;
    
    if (!adminPasscode) {
      console.error('ADMIN_PASSCODE environment variable is not set');
      return NextResponse.json({ valid: false, error: 'Server configuration error' }, { status: 500 });
    }

    const isValid = passcode.trim() === adminPasscode.trim();
    
    return NextResponse.json({ valid: isValid });
  } catch (e: any) {
    console.error('Admin auth error:', e);
    return NextResponse.json({ valid: false, error: 'Error validating admin passcode' }, { status: 400 });
  }
}

