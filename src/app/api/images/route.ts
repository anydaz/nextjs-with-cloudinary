import prisma from "@/app/utils/prisma";

export async function GET() {
  const images = await prisma.image.findMany();
  return Response.json({ data: images });
}
