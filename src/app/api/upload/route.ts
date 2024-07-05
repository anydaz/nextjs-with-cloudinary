import cloudinary from "@/app/utils/cloudinary";
import prisma from "@/app/utils/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const b64 = Buffer.from(buffer).toString("base64");
    const dataURI = `data:${file.type};base64,${b64}`;
    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

    try {
      await prisma.$transaction(async (tx) => {
        const newImage = await prisma.image.create({
          data: {
            name: fileNameWithoutExtension,
          },
        });

        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          public_id: fileNameWithoutExtension,
          overwrite: false,
        });

        await prisma.image.update({
          data: {
            url: uploadResult.secure_url,
          },
          where: {
            id: newImage.id,
          },
        });
      });
      return Response.json({ data: "OK" });
    } catch (error) {
      console.error("Transaction Error:", error);
      return Response.json({ data: "ERR" }, { status: 422 });
    }
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ data: "ERR" }, { status: 422 });
  }
}
