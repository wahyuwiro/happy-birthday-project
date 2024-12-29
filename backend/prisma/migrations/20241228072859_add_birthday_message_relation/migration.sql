-- CreateTable
CREATE TABLE "BirthdayMessage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "retryCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BirthdayMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BirthdayMessage" ADD CONSTRAINT "BirthdayMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
