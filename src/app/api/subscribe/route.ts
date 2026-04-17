import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email } = await request.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.active) {
        await prisma.subscriber.update({
          where: { email },
          data: { active: true, firstName, lastName },
        });
        return NextResponse.json({
          message: "Welcome back! You have been re-subscribed.",
        });
      }
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      );
    }

    await prisma.subscriber.create({
      data: { firstName, lastName, email },
    });

    // Send confirmation email (non-blocking)
    sendConfirmationEmail(email, firstName).catch(console.error);

    return NextResponse.json(
      { message: "Successfully subscribed! Check your email for confirmation." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
