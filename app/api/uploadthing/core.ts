import { getAuthSession } from "@/lib/next-auth-options";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await getAuthSession();
  console.log(session);
  const userId = session?.user.id;
  if (!userId) {
    console.log("error");
    throw new Error("Unauthorised");
  }
  return { userId };
};

export const ourFileRouter = {
  billboardImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  productImages: f({ image: { maxFileSize: "4MB", maxFileCount: 3 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
