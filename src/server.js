import express from "express" 
import listEndpoints from "express-list-endpoints"
import blogsRouter from "./services/index.js"
import cors from "cors"


const server = express()

const port = 3001

server.use(express.json()) 

server.use(cors())

server.use("/blogs", blogsRouter)

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})