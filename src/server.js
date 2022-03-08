import express from "express" 
import listEndpoints from "express-list-endpoints"
import blogsRouter from "./services/index.js"
import cors from "cors"
import { badRequestHandler, unauthorizedHandler, notFoundHandler, genericErrorHandler } from "./errorhandlers.js"
import filesRouter from "./services/files/index.js"
import authorsRouter from "./services/authors/index.js"
import {join} from "path"

const server = express()

const port = process.env.PORT

const publicFolderPath = join(process.cwd(), "./public/img")

const corsOrigin =  [process.env.PROD, process.env.FE]


server.use(express.json()) 
server.use(express.static(publicFolderPath))
server.use(cors({origin: function(origin, next){

  if(!origin || corsOrigin.indexOf(origin !== -1)){
    next(null, true)
  } else{
     next(new Error ("cors error!"))
  }
}}))

server.use("/blogs", blogsRouter)
server.use("/authors", authorsRouter)
server.use("/files", filesRouter)

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})