import { utapi } from "uploadthing/server";

export const DeleteFile = async (value: string) => {
  console.log(value);
  await utapi.deleteFiles(value);
};
