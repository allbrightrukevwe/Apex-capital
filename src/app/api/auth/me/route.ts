import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";

const getUser = async (request: Request | NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key") as { id: number };
  return decoded.id;
};

export async function GET(request: Request) {
  try {
    const userId = await getUser(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true, wallets: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUser(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { fullName, country, phone } = await request.json();
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName || undefined,
        firstName: fullName?.split(' ')[0] || undefined,
        lastName: fullName?.split(' ').slice(1).join(' ') || undefined,
        country: country || undefined,
        phone: phone || undefined,
      },
    });
    const { password: _, ...userWithoutPassword } = updated;
    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}