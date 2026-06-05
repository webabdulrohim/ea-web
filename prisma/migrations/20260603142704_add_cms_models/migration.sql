-- CreateTable
CREATE TABLE "LandingContent" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "heroTitle" TEXT NOT NULL DEFAULT 'EA - English Action',
    "heroDesc" TEXT NOT NULL DEFAULT 'Be Brave to Act',
    "ownerName" TEXT NOT NULL DEFAULT 'Owner EA',
    "ownerMsg" TEXT NOT NULL DEFAULT 'Selamat datang...',
    "videoUrl" TEXT NOT NULL DEFAULT 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "mapsUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
