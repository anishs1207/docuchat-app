import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db"; // adjust path if needed

// GET /bins (based on userId), bins, spaces and chats for a user
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");
    
  
    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    console.log(userId);

    const bins = await prisma.bin.findMany({
      where: {
        userId: userId, 
      },
      orderBy: {
        name: "asc",
      },
     include: {
      spaces: {
        include: {
          conversations: true,
      },
    },
  },
    });

    return NextResponse.json(bins);
  } catch (error) {
    console.error("GET /api/bins error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bins" },
      { status: 500 }
    );
  }
}

// POST /api/bins => create a bin with name and color
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("user-id");

    if (!userId) {
      return NextResponse.json({error: "Missing userId"}, {status: 400})
    }

    const { binName, color } = await req.json();

    if (!binName || !color) {
      return NextResponse.json({ error: "Missing binName or color" }, { status: 400 });
    }

    const newBin = await prisma.bin.create({
      data: {
        name: binName,
        color,
        numOfSpaces: 0,
        userId: userId,
      },
    });

    return NextResponse.json({data: newBin, message: "New Bin is created successfully"}, {status: 200});
  } catch (error) {
    console.error("POST /api/bins error:", error);
    return NextResponse.json({ error: "Failed to create bin" }, { status: 500 });
  }
}

// DELETE /api/bins => delete bin by ID
export async function DELETE(req: NextRequest) {
  try {
    const binId = req.headers.get("binId");

    if (!binId) {
      return NextResponse.json({ error: "Missing binId" }, { status: 400 });
    }

    // Step 1: Find all spaceIds for the bin
    const spaces = await prisma.space.findMany({
      where: { binId },
      select: { spaceId: true },
    });

    const spaceIds = spaces.map((space) => space.spaceId);

    // Step 2: Delete all chats associated with those spaces
    await prisma.chat.deleteMany({
      where: {
        spaceId: {
          in: spaceIds,
        },
      },
    });

    // Step 3: Delete all spaces associated with the bin
    await prisma.space.deleteMany({
      where: {
        binId,
      },
    });

    // Step 4: Delete the bin itself
    await prisma.bin.delete({
      where: {
        id: binId,
      },
    });

    return NextResponse.json({ message: "Bin, its spaces, and chats deleted successfully." });
  } catch (error) {
    console.error("Error deleting bin and associated data:", error);
    return NextResponse.json({ error: "Failed to delete bin and associated data" }, { status: 500 });
  }
}

// PATCH /api/bins => update bin name
export async function PATCH(req: NextRequest) {
  try {
    const binId = req.headers.get("binId");
    const body = await req.json();
    const { newName } = body;

    if (!binId || !newName) {
      return NextResponse.json({ error: "Missing binId or newName" }, { status: 400 });
    }

    const updatedBin = await prisma.bin.update({
      where: { id: binId },
      data: { name: newName },
    });

    return NextResponse.json({data: updatedBin, message: "Bins Renamed Successfully"}, {status: 200});
  } catch (error) {
    console.error("PATCH /api/bins error:", error);
    return NextResponse.json({ error: "Failed to update bin name" }, { status: 500 });
  }
}
