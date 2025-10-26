-- CreateEnum
CREATE TYPE "public"."ChatAuthor" AS ENUM ('ai', 'user');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "numOfSpaces" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Space" (
    "spaceId" TEXT NOT NULL,
    "spaceName" TEXT NOT NULL,
    "lastUsedNumOfDays" INTEGER NOT NULL,
    "binId" TEXT NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("spaceId")
);

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" TEXT NOT NULL,
    "writtenBy" "public"."ChatAuthor" NOT NULL,
    "messageContent" TEXT NOT NULL,
    "writtenAtTime" TIMESTAMP(3) NOT NULL,
    "documentAssociatedName" TEXT[],
    "spaceId" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Bin" ADD CONSTRAINT "Bin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Space" ADD CONSTRAINT "Space_binId_fkey" FOREIGN KEY ("binId") REFERENCES "public"."Bin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "public"."Space"("spaceId") ON DELETE RESTRICT ON UPDATE CASCADE;
