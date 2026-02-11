import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Demo authentication logic
    // In a real app, you would query the database and verify the hashed password
    if (email === 'admin@invest.com' && password === 'password123') {
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      console.log('Login successful for:', email)

      return NextResponse.json(
        {
          message: 'Login successful',
          token,
          user: {
            id: 'user_admin_001',
            email: 'admin@invest.com',
            fullName: 'Admin User',
            role: 'admin',
          },
        },
        { status: 200 }
      )
    }

    // For other emails, simulate a pending approval status
    console.log('Login attempt for:', email)

    return NextResponse.json(
      { error: 'Your account is pending approval. Please check back soon.' },
      { status: 403 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
