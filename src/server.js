import express from "express" 
import listEndpoints from "express-list-endpoints"
import blogsRouter from "./services/index.js"
import cors from "cors"
import { badRequestHandler, unauthorizedHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers.js"


const server = express()

const port = 3001

server.use(express.json()) 

server.use(cors())

server.use("/blogs", blogsRouter)

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})