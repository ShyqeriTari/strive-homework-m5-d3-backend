
import express from "express" 
import fs from "fs" 
import { fileURLToPath } from "url" 
import { dirname, join } from "path" 
import uniqId from "uniqId" 
import cors from "cors"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { newBlogValidation } from "./blogValidation.js"

const blogsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogs.json")
const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath))
const writeBlogs = fs.writeFileSync(blogsJSONPath, JSON.stringify(blogsArray))

const blogsRouter = express.Router()

blogsRouter.post("/", cors(), newBlogValidation, (request, response, next) => {

    try {
        const errorGroup = validationResult(request)
        if(errorGroup.isEmpty()){
        const newBlog = { id: uniqId(), ...request.body, createdAt: new Date() }       
      
        blogsArray.push(newBlog)
      
        writeBlogs
      
        response.status(201).send({ newBlog })
        }else{

      next(createHttpError(400, "Some errors occurred in req body", { errorGroup }))
        }
    } catch (error) {
        next(error)
    }
  
})


blogsRouter.get("/", cors(), (request,  response, next) => {

    try {
      
        response.send(blogsArray)
        
    } catch (error) {
        next(error)
    }
 
})


blogsRouter.get("/:blogId", cors(), (request, response, next) => {
try {

    const foundBlog = blogsArray.find(blog => blog.id === request.params.blogId)
  
    response.send(foundBlog)
} catch (error) {
    next(error)
}

  
})


blogsRouter.put("/:blogId", cors(), (request, response, next) => {
try {

    const index = blogsArray.findIndex(blog => blog.id === request.params.blogId)
    const oldBlog = blogsArray[index]
    const updatedBlog = { ...oldBlog, ...request.body}
  
    blogsArray[index] = updatedBlog
  
  
   writeBlogs
  
    response.send(updatedBlog)
    
} catch (error) {
    next(error)
}

})


blogsRouter.delete("/:blogId", cors(), (request, response, next) => {

    try {

  const remainingBlogs = blogsArray.filter(blog => blog.id !== request.params.blogId)

 writeBlogs

  response.status(204).send()
        
    } catch (error) {
        next(error)
    }

  
})

export default blogsRouter