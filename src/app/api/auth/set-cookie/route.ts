import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 30 * 60,
    });

    return response;
  } catch (error) {
    console.error("Error setting auth cookie: ", error);
    return NextResponse.json(
      { error: "Error setting auth cookie" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: "authToken",
    value: "",
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  return response;
}

export async function GET(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;

  if (!authToken) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  return NextResponse.json({ authToken });
}
