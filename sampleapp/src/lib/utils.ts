import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { Role } from "../generated/prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const roleHierarchy = {
    [Role.OWNER]: 3,
    [Role.MANAGER]: 2,
    [Role.USER]: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
