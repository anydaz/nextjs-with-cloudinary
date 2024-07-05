import cloudinary from "@/app/utils/cloudinary";
import prisma from "@/app/utils/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const image = await prisma.image.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!image) throw "No Image Found";

    await cloudinary.uploader.destroy(image.name);
    await prisma.image.delete({
      where: {
        id: parseInt(id),
      },
    });

    return Response.json({ data: "OK" });
  } catch (error) {
    return Response.json({ data: "ERR" }, { status: 422 });
  }
}
