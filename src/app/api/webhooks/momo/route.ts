import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return NextResponse.json(
    { message: 'MoMo webhook placeholder — Phase 3 implementation' },
    { status: 200 }
  )
}
