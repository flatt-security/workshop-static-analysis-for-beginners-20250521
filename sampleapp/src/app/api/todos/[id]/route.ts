import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "../../../../lib/db";
import { authOptions } from "../../../../lib/auth";
import { hasPermission } from "../../../../lib/utils";
import { Role } from "../../../../generated/prisma";

async function canAccessTodo(userId: string, todoId: string, role: string, tenantId: string) {
  const todo = await db.todo.findUnique({
    where: { id: todoId },
  });

  if (!todo) return false;

  if (todo.tenantId !== tenantId) return false;

  if (role === Role.OWNER || role === Role.MANAGER) return true;

  return todo.userId === userId;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todoId = params.id;
    const hasAccess = await canAccessTodo(
      session.user.id,
      todoId,
      session.user.role,
      session.user.tenantId
    );

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const todo = await db.todo.findUnique({
      where: { id: todoId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json(
      { error: "Failed to fetch todo" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todoId = params.id;
    const hasAccess = await canAccessTodo(
      session.user.id,
      todoId,
      session.user.role,
      session.user.tenantId
    );

    // bug!
    // if (!hasAccess) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const { title, description, completed } = await request.json();

    const updatedTodo = await db.todo.update({
      where: { id: todoId },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(completed !== undefined ? { completed } : {}),
      },
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todoId = params.id;
    // bug!
    // const hasAccess = await canAccessTodo(
    //   session.user.id,
    //   todoId,
    //   session.user.role,
    //   session.user.tenantId
    // );

    // if (!hasAccess) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    await db.todo.delete({
      where: { id: todoId },
    });

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
