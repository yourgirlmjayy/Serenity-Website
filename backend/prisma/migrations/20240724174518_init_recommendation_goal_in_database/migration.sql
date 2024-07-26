-- CreateTable
CREATE TABLE "Recommendation" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "activity" TEXT NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "activity" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recommendation_id_key" ON "Recommendation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Goal_id_key" ON "Goal"("id");

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
