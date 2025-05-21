import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "../../../../lib/db";
import { authOptions } from "../../../../lib/auth";
import { hashPassword, hasPermission } from "../../../../lib/utils";
import { Role } from "../../../../generated/prisma";

async function canInviteUser(userRole: string): Promise<boolean> {
  return hasPermission(userRole as Role, Role.MANAGER) || userRole === Role.OWNER;
}

async function canCreateManagerRole(userRole: string, newUserRole: string): Promise<boolean> {
  if (newUserRole !== Role.MANAGER) return true;
  return userRole === Role.OWNER;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasAccess = await canInviteUser(session.user.role);

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (role && !Object.values(Role).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const canCreateRole = await canCreateManagerRole(session.user.role, role);

    if (!canCreateRole) {
      return NextResponse.json(
        { error: "Only owners can create managers" },
        { status: 403 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || Role.USER,
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inviting user:", error);
    return NextResponse.json(
      { error: "Failed to invite user" },
      { status: 500 }
    );
  }
}
