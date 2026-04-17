import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewsletterEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "";

    const where = status ? { status } : {};

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: { select: { views: true, emailLogs: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch articles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, excerpt, status, sendNewsletter } =
      await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.substring(0, 200) + "...",
        status: status || "draft",
        sendNewsletter: sendNewsletter ?? true,
        publishedAt: status === "published" ? new Date() : null,
      },
    });

    // Send newsletter if published and sendNewsletter is true
    if (status === "published" && sendNewsletter) {
      const subscribers = await prisma.subscriber.findMany({
        where: { active: true },
      });

      // Send emails in background
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

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
