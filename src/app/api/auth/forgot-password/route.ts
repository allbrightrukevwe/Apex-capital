import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token to user (you might need to add this field to your schema)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // Uncomment if you have these fields in your schema
        // resetToken: resetToken,
        // resetTokenExpiry: resetTokenExpiry
      }
    });

    // In production, send email with reset link
    // const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    // await sendEmail(email, "Password Reset", `Click here: ${resetLink}`);

    return NextResponse.json(
      { 
        message: "Password reset email sent",
        // Remove in production
        resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}