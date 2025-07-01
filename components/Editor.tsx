"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "react-quill-new/dist/quill.snow.css";
import { slugify } from "slugmaster";
import ImageUpload from "./imageUpload";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function Editor({ onSave }) {
  const { register, handleSubmit } = useForm();
  const [content, setContent] = useState("");
  const [ogImage, setOgImage] = useState("");
  const handleForm = (data) => {
    const generatedSlug = slugify(data.title);
    onSave({ ...data, slug: generatedSlug, ogImage, content });
  };
  return (
    <section>
      <form className="space-y-4" onSubmit={handleSubmit(handleForm)}>
        <input
          {...register("title")}
          placeholder="Enter the post title"
          className="font-bold text-xl bg-zinc-600 px-3 py-2 rounded-sm outline-none  w-full"
          type="text"
        ></input>

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link", "image"],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "indent",
            "link",
            "image",
          ]}
        />

        <input
          {...register("excerpts")}
          placeholder="Enter Excerpts"
          className="font-bold text-xl bg-zinc-600 px-3 py-2 rounded-sm outline-none  w-full"
          type="text"
        ></input>
        <input
          {...register("category")}
          placeholder="Enter a Category"
          className="font-bold text-xl bg-zinc-600 px-3 py-2 rounded-sm outline-none  w-full"
          type="text"
        ></input>
        <h2 className="text-xl font-bold">SEO Data</h2>
        <ImageUpload returnImage={setOgImage} />
        <input
          {...register("MetaDescription")}
          placeholder="Enter a Meta Description"
          className="font-bold text-xl bg-zinc-600 px-3 py-2 rounded-sm outline-none  w-full"
          type="text"
        ></input>
        <input
          {...register("keywords")}
          placeholder="Enter keywords"
          className="font-bold text-xl bg-zinc-500 px-3 py-2 rounded-sm outline-none  w-full"
          type="text"
        ></input>
        <div className="mt-4 flex gap-2">
          <select
            {...register("status")}
            className="font-bold text-lg text-white bg-zinc-600 px-3 py-1"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Publish</option>
          </select>
          <button
            type="submit"
            className=" bg-zinc-500 px-3 py-2 rounded cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </section>
  );
}
