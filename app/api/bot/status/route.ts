import { NextResponse } from "next/server";
const BOT_URL = process.env.WA_BOT_URL || "http://localhost:3010";
export async function GET() {
  try {
    const res = await fetch(`${BOT_URL}/status`, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: "offline", whatsapp: "disconnected", conversasAtivas: 0, conversas: [] });
  }
}
