import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

function monthLabel(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short" });
}

function monthRange(monthsAgo: number) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 1);
  return { start, end, label: monthLabel(start) };
}

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const months = [5, 4, 3, 2, 1, 0].map(monthRange);

  const [
    totalUsers,
    totalListings,
    totalMessages,
    totalConsultations,
    totalDiagnoses,
    totalArticles,
    revenueAgg,
    ordersByStatusRaw,
    listingsByCategoryRaw,
    usersByRoleRaw,
    verifiableUsers,
    userGrowth,
    revenueByMonth,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.message.count(),
    prisma.consultation.count(),
    prisma.diagnosis.count(),
    prisma.article.count(),
    prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: { status: { in: ["CONFIRMED", "DELIVERED"] } },
    }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.listing.groupBy({ by: ["category"], _count: { _all: true } }),
    prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
    prisma.user.count({ where: { role: { in: ["AGRONOMIST", "ADMIN"] } } }),
    Promise.all(
      months.map(({ start, end, label }) =>
        prisma.user.count({ where: { createdAt: { gte: start, lt: end } } }).then((count: number) => ({ label, count }))
      )
    ),
    Promise.all(
      months.map(({ start, end, label }) =>
        prisma.order
          .aggregate({
            _sum: { totalPrice: true },
            where: {
              status: { in: ["CONFIRMED", "DELIVERED"] },
              createdAt: { gte: start, lt: end },
            },
          })
          .then((r: { _sum: { totalPrice: number | null } }) => ({ label, total: r._sum.totalPrice ?? 0 }))
      )
    ),
  ]);

  const verifiedCount = await prisma.user.count({
    where: { role: { in: ["AGRONOMIST", "ADMIN"] }, verified: true },
  });

  const ordersByStatus = ordersByStatusRaw.map(
    (r: { status: string; _count: { _all: number } }) => ({
      label: r.status.charAt(0) + r.status.slice(1).toLowerCase(),
      count: r._count._all,
    })
  );

  const listingsByCategory = listingsByCategoryRaw.map(
    (r: { category: string; _count: { _all: number } }) => ({
      label: r.category,
      count: r._count._all,
    })
  );

  const usersByRole = usersByRoleRaw.map(
    (r: { role: string; _count: { _all: number } }) => ({
      label: r.role.charAt(0) + r.role.slice(1).toLowerCase() + "s",
      count: r._count._all,
    })
  );

  const maxUserGrowth = Math.max(1, ...userGrowth.map((m: { count: number }) => m.count));
  const maxRevenue = Math.max(1, ...revenueByMonth.map((m: { total: number }) => m.total));
  const maxOrders = Math.max(1, ...ordersByStatus.map((o: { count: number }) => o.count));
  const maxListings = Math.max(1, ...listingsByCategory.map((l: { count: number }) => l.count));
  const maxRoles = Math.max(1, ...usersByRole.map((r: { count: number }) => r.count));

  return NextResponse.json({
    overview: {
      totalUsers,
      totalListings,
      totalRevenue: revenueAgg._sum.totalPrice ?? 0,
      totalMessages,
      totalConsultations,
      totalDiagnoses,
      totalArticles,
      verifiedRate: verifiableUsers > 0 ? Math.round((verifiedCount / verifiableUsers) * 100) : 100,
    },
    userGrowth: userGrowth.map((m: { label: string; count: number }) => ({ ...m, percent: Math.round((m.count / maxUserGrowth) * 100) })),
    revenueByMonth: revenueByMonth.map((m: { label: string; total: number }) => ({ ...m, percent: Math.round((m.total / maxRevenue) * 100) })),
    ordersByStatus: ordersByStatus.map((o: { label: string; count: number }) => ({ ...o, percent: Math.round((o.count / maxOrders) * 100) })),
    listingsByCategory: listingsByCategory.map((l: { label: string; count: number }) => ({ ...l, percent: Math.round((l.count / maxListings) * 100) })),
    usersByRole: usersByRole.map((r: { label: string; count: number }) => ({ ...r, percent: Math.round((r.count / maxRoles) * 100) })),
  });
}
