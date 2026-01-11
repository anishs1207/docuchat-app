import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// POST a new space with default name
export async function POST(req: NextRequest) {
  try {
    const binId = req.headers.get("binId");

    if (!binId) {
      return NextResponse.json({ error: "Missing binId" }, { status: 400 });
    }

    const { lastUsedDate } = await req.json();

    if (!lastUsedDate) {
      return NextResponse.json(
        { error: "Missing lastUsedDate attribute" },
        { status: 400 }
      );
    }

    const space = await prisma.space.create({
      data: {
        binId,
        spaceName: "Untitled Space",
        lastUsed: lastUsedDate,
      },
    });

    const chat = await prisma.chat.create({
      data: {
        spaceId: space.spaceId,
        messageContent: "Hi there",
        writtenAtTime: lastUsedDate,
        writtenBy: "ai",
      },
    });

    return NextResponse.json(
      { data: { space, chat }, message: "New Space is Created" },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/spaces", error);
    return NextResponse.json(
      { error: "Failed to create space" },
      { status: 500 }
    );
  }
}

// PATCH a space to rename it
export async function PATCH(req: NextRequest) {
  try {
    const spaceId = req.headers.get("spaceId");
    const { newSpaceName } = await req.json();

    if (!spaceId || !newSpaceName) {
      return NextResponse.json(
        { error: "Missing spaceId or spaceName" },
        { status: 400 }
      );
    }

    const updated = await prisma.space.update({
      where: { spaceId },
      data: { spaceName: newSpaceName },
    });

    return NextResponse.json(
      { data: updated, message: "Space is renamed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/spaces", error);
    return NextResponse.json(
      { error: "Failed to rename space" },
      { status: 500 }
    );
  }
}

// DELETE a space
export async function DELETE(req: NextRequest) {
  try {
    const spaceId = req.headers.get("spaceId");

    if (!spaceId) {
      return NextResponse.json({ error: "Missing spaceId" }, { status: 400 });
    }

    await prisma.chat.deleteMany({
      where: { spaceId },
    });

    await prisma.space.delete({
      where: { spaceId },
    });

    return NextResponse.json({
      message: "Space and conversations deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/spaces", error);
    return NextResponse.json(
      { error: "Failed to delete space and conversations" },
      { status: 500 }
    );
  }
}
