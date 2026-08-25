import { NextRequest, NextResponse } from "next/server";

const BOT_URL = process.env.WA_BOT_URL || "http://localhost:3010";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ phone: string }> }
) {
  try {
    const { phone } = await params;
    const res = await fetch(`${BOT_URL}/conversa/${phone}`, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ phone: "", historico: [], error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ phone: string }> }
) {
  try {
    const { phone } = await params;
    const res = await fetch(`${BOT_URL}/conversa/${phone}`, {
      method: "DELETE",
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
