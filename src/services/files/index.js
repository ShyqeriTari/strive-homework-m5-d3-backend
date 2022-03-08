
   
import express from "express"
import multer from "multer" 
import { saveAuthorsPictures, saveBlogsPictures } from "../../lib/fs-tools.js"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"

import { CloudinaryStorage } from "multer-storage-cloudinary"
import {v2 as cloudinary} from "cloudinary"

const blogsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../blogs.json")
const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath))
const writeBlogs = content => fs.writeFileSync(blogsJSONPath, JSON.stringify(content))

const authorsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../authors/authors.json")
const getAuthors = () => JSON.parse(fs.readFileSync(authorsJSONPath))
const writeAuthors = content => fs.writeFileSync(authorsJSONPath, JSON.stringify(content))


const filesRouter = express.Router()

const cloudStorageAut = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "authorM5",
  },
})
const cloudMulterAut = multer({ storage: cloudStorageAut })

const cloudStorageBlog = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blogM5",
  },
})
const cloudMulterBlog = multer({ storage: cloudStorageBlog })

filesRouter.post("/authors/:id/uploadAvatar",  multer().single("avatar"), async (request, response, next) => {
 
    const authorsArray = getAuthors()

    try {
    await saveAuthorsPictures(request.file.originalname, request.file.buffer)
    console.log(request.file)

      const index = authorsArray.findIndex(author => author.id === request.params.id)
            const oldAuthor = authorsArray[index]
            const newUrl = `http://localhost:3001/img/authors/${request.file.originalname}`
            const updatedAuthor = { ...oldAuthor, avatar: newUrl}

            authorsArray[index] = updatedAuthor

            writeAuthors(authorsArray)
    response.send(updatedAuthor)
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/authors/:id/cloudinaryUpload", cloudMulterAut.single("author"), async (req, res, next) => {
  try {

    const authors = await getAuthors()

    const index = authors.findIndex(author => author.id === req.params.id)

    if (index !== -1) {

      const oldAuthor = authors[index]

      const updatedAuthor = { ...oldAuthor, authorM5: req.file.path }

      authors[index] = updatedAuthor

      await writeAuthors(authors)

      res.send("Uploaded authors on Cloudinary!")
    } else {
      next(createHttpError(404))
    }
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

  filesRouter.post("/blogs/:id/cloudinaryUpload", cloudMulterBlog.single("blog"), async (req, res, next) => {
    try {
  
      const blogs = await getBlogs()
  
      const index = blogs.findIndex(blog => blog.id === req.params.id)
  
      if (index !== -1) {
  
        const oldBlog = authors[index]
  
        const updatedBlog = { ...oldBlog, blogM5: req.file.path }
  
        blogs[index] = updatedBlog
  
        await writeBlogs(blogs)
  
        res.send("Uploaded blogs on Cloudinary!")
      } else {
        next(createHttpError(404))
      }
    } catch (error) {
      next(error)
    }
  })
  

export default filesRouter