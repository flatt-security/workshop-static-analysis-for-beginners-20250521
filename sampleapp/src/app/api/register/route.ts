import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { hashPassword } from "../../../lib/utils";
import { Role } from "../../../generated/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password, tenantName } = await request.json();

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const tenant = await db.tenant.create({
      data: {
        name: tenantName,
      },
    });

    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.OWNER,
        tenantId: tenant.id,
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        tenantId: tenant.id,
        tenantName: tenant.name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
