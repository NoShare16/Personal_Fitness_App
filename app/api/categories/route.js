import { NextResponse } from "next/server";
import connectDb from "../../../libs/database";
import Category from "../../../database/category.models";

export async function POST(request) {
  const { name } = await request.json();
  await connectDb();
  await Category.create({ name });
  return NextResponse.json({ message: "Category created" }, { status: 201 });
}

export async function GET() {
  await connectDb();
  const categories = await Category.find();
  return NextResponse.json({ categories });
}

export async function DELETE(request) {
  const { id } = await request.json();
  await connectDb();
  await Category.findByIdAndDelete(id);
  return NextResponse.json({ message: "Category deleted" }, { status: 200 });
}

export async function PUT(request) {
  const { id, name } = await request.json();
  await connectDb();
  await Category.findByIdAndUpdate(id, { name });
  return NextResponse.json({ message: "Category updated" }, { status: 200 });
}
