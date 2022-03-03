
   
import express from "express"
import multer from "multer"
import { saveAuthorsPictures, saveBlogsPictures } from "../../lib/fs-tools.js"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"

const blogsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../blogs.json")
const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath))
const writeBlogs = content => fs.writeFileSync(blogsJSONPath, JSON.stringify(content))

const authorsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../authors/authors.json")
const getAuthors = () => JSON.parse(fs.readFileSync(authorsJSONPath))
const writeAuthors = content => fs.writeFileSync(authorsJSONPath, JSON.stringify(content))

const filesRouter = express.Router()

filesRouter.post("/authors/:id/uploadAvatar", multer().single("avatar"), async (request, response, next) => {
 
    const authorsArray = getAuthors()

    try {
    await saveAuthorsPictures(request.file.originalname, request.file.buffer)
    console.log(request.file)

      const index = authorsArray.findIndex(author => author.id === request.params.id)
            const oldAuthor = authorsArray[index]
            const newUrl = `http://localhost:3001/img/authors/${request.file.originalname}`
            const updatedAuthor = { ...oldAuthor, avatar: newUrl}

            authorsArray[index] = updatedAuthor

            writeBlogs(authorsArray)
    response.send(updatedAuthor)
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/blogPosts/:id/uploadCover", multer().single("cover"), async (request, response, next) => {
    const blogsArray = getBlogs()
    try {
      await saveBlogsPictures(request.file.originalname, request.file.buffer)
      console.log(request.file)

      const index = blogsArray.findIndex(blog => blog.id === request.params.id)
            const oldBlog = blogsArray[index]
            const newUrl = `http://localhost:3001/img/blogs/${request.file.originalname}`
            const updatedBlog = { ...oldBlog, cover: newUrl}

            blogsArray[index] = updatedBlog

            writeBlogs(blogsArray)
      response.send(updatedBlog)
    } catch (error) {
      next(error)
    }
  })

export default filesRouter