import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/passwords";
import { createSession, dashboardPathForRole } from "@/lib/session";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body: LoginBody = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Please enter your email and password." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordMatches = await verifyPassword(body.password, user.password);

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (user.suspended) {
      return NextResponse.json(
        {
          error:
            "This account has been suspended. Contact an administrator for help.",
        },
        { status: 403 }
      );
    }

    await createSession({
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    return NextResponse.json({
      success: true,
      role: user.role,
      redirectTo: dashboardPathForRole(user.role),
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
