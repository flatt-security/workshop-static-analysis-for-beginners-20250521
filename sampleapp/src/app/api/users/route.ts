import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "../../../lib/db";
import { authOptions } from "../../../lib/auth";
import { hasPermission } from "../../../lib/utils";
import { Role } from "../../../generated/prisma";

async function canListUsers(role: string): Promise<boolean> {
  return hasPermission(role as Role, Role.MANAGER) || role === Role.OWNER;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasAccess = await canListUsers(session.user.role);

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await db.user.findMany({
      where: {
        tenantId: session.user.tenantId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
