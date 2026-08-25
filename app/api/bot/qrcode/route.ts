import { NextResponse } from "next/server";
const BOT_URL = process.env.WA_BOT_URL || "http://localhost:3010";
export async function GET() {
  try {
    const res = await fetch(`${BOT_URL}/qrcode`, { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ connected: false, error: "Bot indisponível" });
  }
}
