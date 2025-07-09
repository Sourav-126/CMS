import { useState } from "react";
import { uploadToBlob } from "@/utils/uploadToBlob";
import Image from "next/image";
export default function ImageUpload({
  returnImage,
  preloadedImage,
}: {
  returnImage: (url: string) => void;
  preloadedImage: string;
}) {
  const [, setImageAsFile] = useState<File>();
  const [loading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target?.files?.[0];
    setImageAsFile(image!);
    if (image) {
      const { url } = await uploadToBlob(image);
      setImageUrl(url);
      console.log(url);
      returnImage(url);
    } else {
      console.log("error happens while uploading the image");
    }
  };

  if (preloadedImage) {
    return (
      <div>
        <label className="w-fit">
          <span className="bg-gray-500/10 border-2 p-3 rounded-lg border-gray-500 border-dashed cursor-pointer">
            Update Cover Image
          </span>
          <input type="file" onChange={handleImageFile} hidden />
        </label>
        <Image
          className="border border-gray-400 rounded-md "
          src={preloadedImage}
          alt="upload Image"
          width={200}
          height={150}
        />
      </div>
    );
  }

  return (
    <div className="py-2 flex flex-col  gap-2 w-full">
      <label className="w-fit">
        <span className="bg-gray-500/10 border-2 p-3 rounded-lg border-gray-500 border-dashed cursor-pointer">
          Upload Cover Image
        </span>
        <input type="file" onChange={handleImageFile} hidden />
      </label>
      <div>
        {loading && <button disabled>Uploading...</button>}
        {imageUrl && (
          <div className="">
            <h3> Uploaded Successfully!</h3>
            <Image
              className="border border-gray-400 rounded-md "
              src={imageUrl}
              alt="upload Image"
              style={{ width: "30%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
