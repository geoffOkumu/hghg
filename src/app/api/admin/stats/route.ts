import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalSubscribers,
      activeSubscribers,
      totalArticles,
      publishedArticles,
      totalViews,
      totalEmailsSent,
      recentSubscribers,
      subscriberGrowth,
    ] = await Promise.all([
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { active: true } }),
      prisma.article.count(),
      prisma.article.count({ where: { status: "published" } }),
      prisma.articleView.count(),
      prisma.emailLog.count({ where: { status: "sent" } }),
      prisma.subscriber.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
        },
      }),
      prisma.subscriber.groupBy({
        by: ["createdAt"],
        _count: true,
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);

    return NextResponse.json({
      totalSubscribers,
      activeSubscribers,
      totalArticles,
      publishedArticles,
      totalViews,
      totalEmailsSent,
      recentSubscribers,
      subscriberGrowth,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
