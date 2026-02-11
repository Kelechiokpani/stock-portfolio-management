import { NextRequest, NextResponse } from 'next/server'

// Mock storage for access requests
let accessRequests: Array<{
  id: string
  email: string
  fullName: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fullName } = body

    // Validation
    if (!email || !fullName) {
      return NextResponse.json(
        { message: 'Email and full name are required' },
        { status: 400 }
      )
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Check if already requested
    const existingRequest = accessRequests.find((r) => r.email === email)
    if (existingRequest) {
      return NextResponse.json(
        { message: 'You have already submitted an access request' },
        { status: 400 }
      )
    }

    // Create new request
    const newRequest = {
      id: `req_${Date.now()}`,
      email,
      fullName,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    }

    accessRequests.push(newRequest)

    return NextResponse.json(
      {
        success: true,
        message: 'Access request submitted successfully',
        requestId: newRequest.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Access request error:', error)
    return NextResponse.json(
      { message: 'Failed to process access request' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ requests: accessRequests })
}
