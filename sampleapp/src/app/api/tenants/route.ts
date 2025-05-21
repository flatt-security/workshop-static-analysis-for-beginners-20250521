import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "../../../lib/db";
import { authOptions } from "../../../lib/auth";
import { hasPermission } from "../../../lib/utils";
import { Role } from "../../../generated/prisma";

async function canManageTenants(role: string): Promise<boolean> {
  return role === Role.OWNER;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasAccess = await canManageTenants(session.user.role);

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tenants = await db.tenant.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(tenants);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasAccess = await canManageTenants(session.user.role);

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Tenant name is required" },
        { status: 400 }
      );
    }

    const tenant = await db.tenant.create({
      data: {
        name,
      },
    });

    return NextResponse.json(tenant, { status: 201 });
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}
