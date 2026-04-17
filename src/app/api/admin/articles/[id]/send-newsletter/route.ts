import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewsletterEmail } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    if (article.status !== "published") {
      return NextResponse.json(
        { error: "Article must be published first" },
        { status: 400 }
      );
    }

    const subscribers = await prisma.subscriber.findMany({
      where: { active: true },
    });

    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      const result = await sendNewsletterEmail(
        subscriber.email,
        subscriber.firstName,
        article.title,
        article.excerpt || "",
        article.id
      );

      await prisma.emailLog.create({
        data: {
          articleId: article.id,
          type: "newsletter",
          to: subscriber.email,
          subject: `New Article: ${article.title}`,
          status: result.success ? "sent" : "failed",
          resendId: result.success && 'id' in result ? (result.id as string) : null,
          error: !result.success && 'error' in result ? JSON.stringify(result.error) : null,
        },
      });

      if (result.success) sent++;
      else failed++;
    }

    await prisma.article.update({
      where: { id },
      data: { newsletterSent: true },
    });

    return NextResponse.json({
      message: `Newsletter sent to ${sent} subscribers. ${failed} failed.`,
      sent,
      failed,
    });
  } catch (error) {
    console.error("Send newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
}
