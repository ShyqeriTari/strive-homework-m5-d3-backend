
import express from "express" 
import fs from "fs" 
import { fileURLToPath } from "url" 
import { dirname, join } from "path" 
import uniqId from "uniqId" 
import cors from "cors"



const blogsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogs.json")
const blogsArray = JSON.parse(fs.readFileSync(blogsJSONPath))

const blogsRouter = express.Router() 
blogsRouter.post("/", cors(), (request, response, next) => {
    try {
        const newBlog = { ...request.body, id: uniqId(), createdAt: new Date() }       
      
        blogsArray.push(newBlog)
      
        fs.writeFileSync(blogsJSONPath, JSON.stringify(blogsArray)) 
      
        response.status(201).send({ newBlog })
    } catch (error) {
        next(error)
    }
  
})


authorsRouter.get("/", cors(), (request,  response, next) => {

    try {
      
        response.send(blogsArray)
        
    } catch (error) {
        next(error)
    }
 
})


authorsRouter.get("/:blogId", cors(), (request, response, next) => {
try {

    const foundBlog = blogsArray.find(blog => blog.id === request.params.blogId)
  
    response.send(foundBlog)
} catch (error) {
    next(error)
}

  
})


authorsRouter.put("/:blogId", cors(), (request, response, next) => {
try {

    const index = blogsArray.findIndex(blog => blog.id === request.params.blogId)
    const oldBlog = blogsArray[index]
    const updatedBlog = { ...oldBlog, ...request.body}
  
    blogsArray[index] = updatedBlog
  
  
    fs.writeFileSync(blogsJSONPath, JSON.stringify(blogsArray))
  
    response.send(updatedBlog)
    
} catch (error) {
    next(error)
}

})


authorsRouter.delete("/:blogId", cors(), (request, response, next) => {

    try {

  const remainingBlogs = blogsArray.filter(blog => blog.id !== request.params.blogId)

  fs.writeFileSync(blogsJSONPath, JSON.stringify(remainingBlogs))

  response.status(204).send()
        
    } catch (error) {
        next(error)
    }

  
})

export default blogsRouter