-- CreateTable
CREATE TABLE "Wall" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "context" TEXT,
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "isClosed" BOOLEAN,

    CONSTRAINT "Wall_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "index_walls_on_owner_id" ON "Wall"("ownerId");
