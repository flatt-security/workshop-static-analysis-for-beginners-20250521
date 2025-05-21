import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "../../../lib/db";
import { authOptions } from "../../../lib/auth";
import { hasPermission } from "../../../lib/utils";
import { Role } from "../../../generated/prisma";

async function canListTodos(userId: string, role: string): Promise<boolean> {
  // Everyone with a valid session can list todos (filtered by permission in the query)
  return true;
}

async function canCreateTodo(userId: string): Promise<boolean> {
  // Any authenticated user can create a todo
  return true;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasAccess = await canListTodos(session.user.id, session.user.role);

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { user } = session;

    const todos = await db.todo.findMany({
      where: {
        tenantId: user.tenantId,
        ...(user.role === Role.USER ? { userId: user.id } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
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

    const hasAccess = await canCreateTodo(session.user.id);

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, description } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const todo = await db.todo.create({
      data: {
        title,
        description,
        userId: session.user.id,
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
