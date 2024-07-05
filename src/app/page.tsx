"use client";
import { Image as ImgData } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [images, setImages] = useState<ImgData[]>([]);
  const [file, setFile] = useState<File>();

  const upload = async () => {
    if (!file) {
      return alert("no file to be uploaded");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "post",
        body: formData,
      });

      if (!response.ok) {
        return alert("upload failed");
      }

      getImages();
      alert("upload success");
    } catch (error) {
      alert("upload failed");
    }
    await fetch("/api/upload", {
      method: "post",
      body: formData,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/images/${id}`, {
        method: "delete",
      });

      if (!response.ok) {
        return alert("Delete Error");
      }

      getImages();
      alert("Delete Success");
    } catch (error) {
      alert("Delete Error");
    }
  };

  const getImages = async () => {
    const res = await fetch("/api/images");
    const { data } = await res.json();
    setImages(data);
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <div>
      <div>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              const file = e.target.files[0];
              setFile(file);
            }
          }}
        />
        <button onClick={upload}>submit</button>
      </div>

      <div className="flex items-center">
        {images.map((img) => {
          return (
            <div className="relative w-1/4" key={img.id}>
              <Image
                alt={img.name}
                src={img.url!}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }} // optional
              />
              <button
                className="absolute right-0 top-0"
                onClick={() => handleDelete(img.id)}
              >
                delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
