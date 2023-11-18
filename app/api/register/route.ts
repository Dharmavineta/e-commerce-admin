import { registerFormType } from "@/components/forms/RegisterForm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prismaDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body: registerFormType = await req.json();

    const { confirmPassword, ...rest } = body;

    const isUser = await prismaDB.user.findUnique({
      where: {
        email: rest.email,
      },
    });
    if (isUser) {
      return new NextResponse("User already exists, please login", {
        status: 401,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(rest.password, salt);

    const newUser = await prismaDB.user.create({
      data: {
        ...rest,
        password: hashPassword,
      },
    });

    return NextResponse.json(
      { message: "Registration success", newUser },
      { status: 201 }
    );
  } catch (error) {
    console.log("REGISTER ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
