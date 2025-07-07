"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import "react-quill-new/dist/quill.snow.css";
import { slugify } from "slugmaster";
import ImageUpload from "./imageUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ErrorBoundaryHandler } from "next/dist/client/components/error-boundary";
import { Button } from "./ui/button";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
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
import { Sparkle, Sparkles } from "lucide-react";

const schema = z.object({
  title: z
    .string()
    .min(10, { message: "title should be more than 10 or more characters" })
    .min(1, { message: "title must not be empty" }),

  excerpt: z.string().min(10, { message: "Please add some excerpts" }),
  category: z.string().min(1, { message: "Please add a category" }),
  keywords: z.string().min(1, { message: "Please add some keywords" }),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  MetaDescription: z
    .string()
    .min(10, {
      message: "Please add a meta description",
    })
    .optional(),
});

interface EditorProps {
  onSave: (data: any) => void;
  initialData?: any;
}

export default function Editor({ onSave, initialData }: EditorProps) {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();
  const [content, setContent] = useState("");
  const [ogImage, setOgImage] = useState("");
  const ideaRef = useRef<HTMLTextAreaElement | null>(null);
  const [selectionExist, setSelectionExist] = useState(false);
  const closeDialogBtnRef = useRef<HTMLButtonElement | null>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setContent(initialData.content);

      setValue("excerpt", initialData.excerpt || "");
      setOgImage(initialData.thumbnail);

      setValue("keywords", initialData.keywords || "");

      setValue("status", initialData.Status || "DRAFT");

      setValue("MetaDescription", initialData.desc || "");

      setValue("category", initialData.catSlug || "");
    }
  }, [initialData]);

  const handleRepharse = async () => {
    const selection = quillRef.current?.getEditor().getSelection();
    if (selection && selection.length > 0) {
      try {
        const selectedText = quillRef.current
          .getEditor()
          .getText(selection.index, selection.length);

        const response = await AIContent({
          idea: selectedText,
          customInstructions:
            "Rewrite this content in a more engaging and interesting way",
          contentGen: false,
        });
        quillRef.current
          .getEditor()
          .deleteText(selection.index, selection.length);
        quillRef.current.getEditor().insertText(selection.index, response);
        setSelectionExist(false);
      } catch (error) {
        console.error(error);
        toast.error("Uh, Oh!, Something went wrong");
      }
    } else {
      toast.error("No selection found");
    }
  };

  const handleGenerateContentAI = async () => {
    try {
      const response = await AIContent({
        idea: ideaRef.current?.value || "",
        customInstructions: "Generate content with proper Facts",
        contentGen: true,
      });
      setContent(response);
    } catch {
      console.log("no generation");
    }
  };

  const handleForm = (data: any) => {
    try {
      const generatedSlug = initialData
        ? initialData.slug
        : slugify(data.title);
      onSave({ ...data, slug: generatedSlug, ogImage, content });
      toast.success(
        initialData
          ? "Post Updated Successfully"
          : "Your Blog is created successfully"
      );
      if (data.status === "PUBLISHED") {
        router.push(`/blog/${generatedSlug}`);
      }
    } catch (error: any) {
      console.error(error.message);
    } finally {
      if (closeDialogBtnRef.current) closeDialogBtnRef.current.click();
    }
  };

  const handleSelectionChange = () => {
    if (quillRef.current) {
      const selection = quillRef.current.getEditor().getSelection();
      setSelectionExist(selection && selection.length > 0);
    }
  };

  return (
    <section>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (data) => {
          try {
            await schema.parseAsync(data);
            await handleForm(data);
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
        ></input>

        <ReactQuill
          //@ts-ignore
          ref={quillRef}
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
          <DialogTrigger>
            <Button variant="outline">
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
              <Button onClick={handleGenerateContentAI} type="submit">
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
        ></input>
        <input
          {...register("category")}
          placeholder="Enter a Category"
          className="font-bold text-xl bg-zinc-600 px-3 py-2 rounded-sm outline-none  w-full"
          type="text"
        ></input>
        <h2 className="text-xl font-bold">SEO Data</h2>
        <ImageUpload returnImage={setOgImage} preloadedImage={ogImage} />
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
