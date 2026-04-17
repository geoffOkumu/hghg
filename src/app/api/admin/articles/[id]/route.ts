import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewsletterEmail } from "@/lib/email";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        _count: { select: { views: true, emailLogs: true } },
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Fetch article error:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, content, excerpt, status, sendNewsletter } =
      await request.json();

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    const wasPublished = existing.status === "published";
    const isNowPublished = status === "published";

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        excerpt: excerpt || content.substring(0, 200) + "...",
        status,
        sendNewsletter: sendNewsletter ?? existing.sendNewsletter,
        publishedAt:
          !wasPublished && isNowPublished
            ? new Date()
            : existing.publishedAt,
      },
    });

    // Send newsletter if newly published and sendNewsletter is true
    if (!wasPublished && isNowPublished && sendNewsletter && !existing.newsletterSent) {
      const subscribers = await prisma.subscriber.findMany({
        where: { active: true },
      });

      Promise.all(
        subscribers.map(async (subscriber) => {
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
        })
      ).then(() => {
        prisma.article.update({
          where: { id: article.id },
          data: { newsletterSent: true },
        }).catch(console.error);
      }).catch(console.error);
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ message: "Article deleted" });
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
