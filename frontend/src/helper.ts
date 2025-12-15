import { supabase } from "./lib/supabaseClient";

export async function blobUrlToFile(
  blobUrl: string,
  filename: string
): Promise<File> {
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}

export async function uploadImageToSupabase(file:File, folder = 'posts') {
  const postsBucketName = import.meta.env.VITE_POSTS_MEDIA_BUCKET_NAME
  const filepath = `${folder}/${crypto.randomUUID()}-${file.name}`

  const {data, error} = await supabase.storage.from(postsBucketName).upload(filepath, file, {upsert: false});

  if (error) throw error

  return supabase.storage.from(postsBucketName).getPublicUrl(filepath).data.publicUrl;
}  

// export function extractImagesFromContent(content: any): ImageNode[] {
//   const images: ImageNode[] = [];

//   function walk(node: any, path: number[] = []) {
//     if (!node) return;

//     if (node.type === "image" && node.attrs?.src) {
//       images.push({
//         nodePath: path,
//         src: node.attrs.src,
//       });
//     }

//     if (node.content) {
//       node.content.forEach((child: any, index: number) =>
//         walk(child, [...path, index])
//       );
//     }
//   }

//   walk(content);
//   return images;
// }

export async function extractImagesFromContent(content: any) {
  const urls: string[] = []

  function walk(node: any){
    if(!node) return 
    if(node?.type == 'image' && node.attrs?.src)
      urls.push(node.attrs?.src)
    if (Array.isArray(node.content)) {
      node.content.forEach(walk);
    }
  }
  walk(content)
  return urls
}

export function replaceImageWithSupabaseUrls(content: any, map: Map<string, string>) {
  const clonedContent = structuredClone(content)

    function walk(node: any){
    if(!node) return 
    if(node?.type == 'image' && map.has(node.attrs?.src))
      node.attrs.src = map.get(node.attrs?.src)
    if (Array.isArray(node.content)) {
      node.content.forEach(walk);
    }
  }
  walk(clonedContent)
  return clonedContent
}

export async function convertBlobUrlToFile(blobUrl: string) {
  const res = await fetch(blobUrl)
  const fileBlob = await res.blob()
  return new File([fileBlob], "image.png", {type: fileBlob.type})
}