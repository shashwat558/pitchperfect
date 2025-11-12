-- CreateTable
CREATE TABLE "Pitch" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pitchTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pitch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PitchResult" (
    "id" TEXT NOT NULL,
    "pitchId" TEXT NOT NULL,
    "tips" TEXT[],
    "score" TEXT NOT NULL,

    CONSTRAINT "PitchResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PitchFrames" (
    "id" TEXT NOT NULL,
    "pitchId" TEXT NOT NULL,
    "filler_count" INTEGER NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL,
    "eye_contact" DOUBLE PRECISION NOT NULL,
    "transcript_segment" TEXT NOT NULL,
    "wpm" INTEGER NOT NULL,
    "smilePercentage" INTEGER NOT NULL,
    "confidence_score" INTEGER NOT NULL,
    "ai_tip" TEXT NOT NULL,
    "createdAtt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PitchFrames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PitchType" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "system_prompt" TEXT NOT NULL,
    "template_script" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PitchType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PitchResult_pitchId_key" ON "PitchResult"("pitchId");

-- AddForeignKey
ALTER TABLE "Pitch" ADD CONSTRAINT "Pitch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pitch" ADD CONSTRAINT "Pitch_pitchTypeId_fkey" FOREIGN KEY ("pitchTypeId") REFERENCES "PitchType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PitchResult" ADD CONSTRAINT "PitchResult_pitchId_fkey" FOREIGN KEY ("pitchId") REFERENCES "Pitch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PitchFrames" ADD CONSTRAINT "PitchFrames_pitchId_fkey" FOREIGN KEY ("pitchId") REFERENCES "Pitch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
