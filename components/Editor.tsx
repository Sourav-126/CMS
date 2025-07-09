"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import "react-quill-new/dist/quill.snow.css";
import { slugify } from "slugmaster";
import ImageUpload from "./imageUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "./ui/button";
import type ReactQuill from "react-quill-new";

type ReactQuillRef = ReactQuill;
const ReactQuillComponent = dynamic(() => import("react-quill-new"), {
  ssr: false,
});
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";
import AIContent from "@/utils/AIContent";
import { Sparkles } from "lucide-react";

interface Post {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  thumbnail?: string;
  keywords?: string;
  Status: "DRAFT" | "PUBLISHED";

  desc?: string;
  catSlug?: string;
  category?: string;
  MetaDescription?: string;
}

interface onSaveProps {
  title: string;
  excerpt: string;
  category: string;
  keywords: string;
  status: "DRAFT" | "PUBLISHED";
  MetaDescription: string | null;
  slug: string;
  thumbnail: string;
  content: string;
}

interface FormData {
  title: string;
  excerpt: string;
  category: string;
  keywords: string;
  status: "DRAFT" | "PUBLISHED";
  MetaDescription: string | null;
}

const schema = z.object({
  title: z
    .string()
    .min(10, { message: "title should be more than 10 or more characters" })
    .min(1, { message: "title must not be empty" }),

  excerpt: z.string().min(1, { message: "Please add some excerpts" }),
  category: z.string().min(1, { message: "Please add a category" }),

  keywords: z.string().min(1, { message: "Please add some keywords" }),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  MetaDescription: z
    .string()
    .min(1, {
      message: "Please add a meta description",
    })
    .optional(),
});

interface EditorProps {
  onSave: (data: onSaveProps) => void;
  initialData?: Post;
}

export default function Editor({
  onSave,
  initialData,
}: EditorProps): React.JSX.Element {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const [content, setContent] = useState<string>("");
  const [ogImage, setOgImage] = useState<string>("");
  const ideaRef = useRef<HTMLTextAreaElement | null>(null);
  const [selectionExist, setSelectionExist] = useState<boolean>(false);
  const closeDialogBtnRef = useRef<HTMLButtonElement | null>(null);
  const quillRef = useRef<ReactQuillRef | null>(null);

  useEffect(() => {
    if (initialData) {
      console.log(initialData);
      setValue("title", initialData.title);
      setContent(initialData.content);

      setValue("excerpt", initialData.excerpt || "");
      setOgImage(initialData.thumbnail!);

      setValue("keywords", initialData.keywords || "");

      setValue("status", initialData.Status || "DRAFT");

      setValue(
        "MetaDescription",
        initialData.desc || initialData.MetaDescription || ""
      );

      setValue("category", initialData.catSlug || initialData.category || "");
    }
  }, [initialData, setValue]);

  const handleRepharse = async (): Promise<void> => {
    const selection = quillRef.current?.getEditor().getSelection();
    if (selection && selection.length > 0) {
      try {
        const selectedText = quillRef
          ?.current!.getEditor()
          .getText(selection.index, selection.length);

        const response: string = await AIContent({
          idea: selectedText,
          customInstructions:
            "Rewrite this content in a more engaging and interesting way",
          contentGen: false,
        });

        quillRef
          .current!.getEditor()
          .deleteText(selection.index, selection.length);
        quillRef.current!.getEditor().insertText(selection.index, response);
        setSelectionExist(false);
      } catch (error) {
        console.error(error);
        toast.error("Uh, Oh!, Something went wrong");
      }
    } else {
      toast.error("No selection found");
    }
  };

  const handleGenerateContentAI = async (): Promise<void> => {
    try {
      const response: string = await AIContent({
        idea: ideaRef.current?.value || "",
        customInstructions: "Generate content with proper Facts",
        contentGen: true,
      });
      setContent(response);
    } catch (error) {
      console.error("Content generation failed:", error);
      toast.error("Failed to generate content");
    }
  };

  const handleForm = async (data: FormData): Promise<void> => {
    try {
      const generatedSlug = initialData
        ? initialData.slug
        : slugify(data.title);

      const saveData = {
        ...data,
        slug: generatedSlug || "",
        thumbnail: ogImage || "",
        content: content || "",
      };

      console.log("Saving data with thumbnail:", saveData);

      await onSave(saveData);

      toast.success(
        initialData
          ? "Post Updated Successfully"
          : "Your Blog is created successfully"
      );

      if (data.status === "PUBLISHED") {
        router.push(`/blog/${generatedSlug}`);
      }
    } catch (error) {
      console.error("Error in handleForm:", error);
      toast.error("Failed to save post");
    } finally {
      if (closeDialogBtnRef.current) closeDialogBtnRef.current.click();
    }
  };

  const handleSelectionChange = (): void => {
    if (quillRef.current) {
      const selection = quillRef.current.getEditor().getSelection();
      setSelectionExist((selection && selection.length > 0) || false);
    }
  };

  return (
    <section>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (data: FormData) => {
          try {
            console.log(data);
            await schema.parseAsync(data);
            handleForm(data);
          } catch (error) {
            console.error(error);
            if (error instanceof z.ZodError) {
              error.errors.forEach((err) => {
                toast.error(err.message);
              });
            }
          }
        })}
      >
        <input
          {...register("title")}
          placeholder="Enter the post title"
          className="font-bold text-xl bg-zinc-600 px-3 py-2 rounded-sm outline-none  w-full"
          type="text"
        />

        <ReactQuillComponent
          theme="snow"
          value={content}
          onChange={setContent}
          onChangeSelection={handleSelectionChange}
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

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="cursor-pointer" type="button">
              Generate content using AI <Sparkles />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription>
                Give a brief about the content you want to generate
              </DialogDescription>
              <Textarea
                ref={ideaRef}
                placeholder="Enter the content you want to generate"
              />
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleGenerateContentAI}>
                Generate Content
              </Button>
              <DialogClose asChild>
                <Button ref={closeDialogBtnRef} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <input
          {...register("excerpt")}
          placeholder="Enter Excerpts"
          className="font-bold text-xl bg-zinc-600 px-3 py-2 rounded-sm outline-none  w-full"
          type="text"
        />
        <input
          {...register("category")}
          placeholder="Enter a Category"
          className="font-bold text-xl bg-zinc-600 px-3 py-2 rounded-sm outline-none  w-full"
          type="text"
        />
        <h2 className="text-xl font-bold">SEO Data</h2>
        <ImageUpload returnImage={setOgImage} preloadedImage={ogImage} />
        <input
          {...register("MetaDescription")}
          placeholder="Enter a Meta Description"
          className="font-bold text-xl bg-zinc-600 px-3 py-2 rounded-sm outline-none  w-full"
          type="text"
        />
        <input
          {...register("keywords")}
          placeholder="Enter keywords"
          className="font-bold text-xl bg-zinc-500 px-3 py-2 rounded-sm outline-none  w-full"
          type="text"
        />
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
      {selectionExist && (
        <Button
          className="fixed bottom-10 cursor-pointer right-10"
          variant="outline"
          onClick={handleRepharse}
        >
          Rewrite using AI <Sparkles />
        </Button>
      )}
    </section>
  );
}
