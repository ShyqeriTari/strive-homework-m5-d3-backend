
import fs from "fs-extra" 
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const {  writeFile } = fs

const getJSONPath = filename => join(join(dirname(fileURLToPath(import.meta.url)), "../data"), filename)


const authorsPublicFolderPath = join(process.cwd(), "./public/img/authors")
const blogsPublicFolderPath = join(process.cwd(), "./public/img/blogs")


export const saveAuthorsPictures = (filename, contentAsABuffer) => writeFile(join(authorsPublicFolderPath, filename), contentAsABuffer)
export const saveBlogsPictures = (filename, contentAsABuffer) => writeFile(join(blogsPublicFolderPath, filename), contentAsABuffer)