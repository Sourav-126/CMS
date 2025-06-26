import { DateFormat } from "@/utils/dateFormat";
import { Calendar } from "lucide-react";
import Image from "next/image";

export default function SingleBlog() {
  const tempTags = "Reading Books , Depression, Boring ,get a life";
  const tempHtml = "<p> Content</p>";
  return (
    <section>
      <div className="flex items-center flex-col gap-4">
        <Image
          className="rounded border w-[90%] md:w-[600px]"
          src="/images.jpeg"
          width={500}
          height={250}
          alt="Page title"
        />
        <div className="meta-of-a-blog space-y-2">
          <div className="flex gap-2 items-center">
            <Calendar className="text-gray-400 size-4" />
            <p className="text-gray-400 text-xs">
              Created On :{DateFormat(new Date())}
            </p>
          </div>
          <div className="text-xs flex items-center gap-2">
            <p>Category :</p>
            <p className="badge border border-gray-700 w-fit px-2 py-1 rounded bg-gray-600/30">
              Depress!
            </p>
          </div>
          <div className="text-xs flex items-center gap-2">
            <p>Tags :</p>
            {tempTags.split(",").map((tag) => (
              <p className="badge border border-gray-700 w-fit px-2 py-1 rounded bg-gray-600/30">
                {tag}
              </p>
            ))}
          </div>
        </div>
        <div className="content text-sm w-[90%] md:w-2/3  text-gray-300 ">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit
          laboriosam ipsam suscipit modi repudiandae, saepe ducimus reiciendis
          laudantium consequuntur placeat, ea voluptatibus dignissimos dolore.
          Excepturi ex, vel architecto totam quo error natus reiciendis magnam
          praesentium vero illo iusto quam, iste sunt atque voluptas delectus
          maxime quaerat corporis deleniti.
          <br /> Reiciendis natus ipsam impedit? Id hic illo voluptatibus?
          Corrupti unde ipsam eum hic, praesentium quis laudantium voluptatibus
          porro ab fugit quas qui dolorem beatae ut, nesciunt eos delectus, modi
          sit ducimus iusto earum nobis neque quo cumque? Tempora nulla sequi,
          ullam reprehenderit, earum odio, est animi quis
          <br /> distinctio voluptatibus vel! Unde dolor consequatur eligendi
          architecto repudiandae nihil, nam distinctio rem quibusdam, natus
          omnis aliquid recusandae? Placeat ad quis id culpa, neque accusantium
          labore error ducimus quidem odio facilis exercitationem explicabo
          voluptatem iste. Ut rerum facere ad ea cum fugit <br />
          quaerat ipsa, numquam placeat eos in voluptatum doloremque. Nam
          aspernatur tempora animi quas esse et reiciendis odit officiis est in
          numquam explicabo non, quidem nostrum vero a voluptates architecto{" "}
          <br /> velit quos? Ad unde excepturi explicabo corporis. Libero
          corporis fuga eaque velit eveniet temporibus reiciendis est officiis
          architecto quo totam aut obcaecati perferendis expedita error earum
          iusto necessitatibus, rem numquam dicta fugiat esse in.
        </div>
      </div>
    </section>
  );
}
