import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/cache/redis";

export async function GET(request: NextRequest) {
  const deviceToken = request.headers.get("x-device-token");
  if (!deviceToken) {
    return NextResponse.json({ tier: "free" });
  }

  const redis = getRedis();
  const premiumKey = `gen:device:${deviceToken}:premium`;
  const isPremium = await redis.get<string>(premiumKey);

  return NextResponse.json({ tier: isPremium === "true" ? "premium" : "free" });
}
