"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  currentUserId: string;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoItem({
  todo,
  currentUserId,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    try {
      await onUpdate(todo.id, { completed: !todo.completed });
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onUpdate(todo.id, {
        title,
        description: description || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      setIsLoading(true);
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error("Error deleting todo:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className={`${todo.completed ? "bg-gray-50" : "bg-white"}`}>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label
                htmlFor={`title-${todo.id}`}
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id={`title-${todo.id}`}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor={`description-${todo.id}`}
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id={`description-${todo.id}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={handleToggleComplete}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <h3
                  className={`text-lg font-medium ${
                    todo.completed ? "text-gray-500 line-through" : ""
                  }`}
                >
                  {todo.title}
                </h3>
              </div>
              {todo.user.id !== currentUserId && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {todo.user.name}
                </span>
              )}
            </div>
            {todo.description && (
              <p
                className={`mt-2 text-sm text-gray-600 ${
                  todo.completed ? "text-gray-400" : ""
                }`}
              >
                {todo.description}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Created: {new Date(todo.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 bg-gray-50 px-4 py-2">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading || !title.trim()}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
