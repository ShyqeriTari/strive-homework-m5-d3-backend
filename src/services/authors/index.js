
import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import json2csv from "json2csv"
import { pipeline } from "stream"


const currentFilePath = fileURLToPath(import.meta.url)


const parentFolderPath = dirname(currentFilePath)


const authorsJSONPath = join(parentFolderPath, "authors.json")

const getAuthorsReadableStream = () => fs.createReadStream(authorsJSONPath)

const authorsRouter = express.Router()

authorsRouter.post("/", (request, response, next) => {

    try {
        const newAuthor = { ...request.body, id: uniqid() }


        const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))


        authorsArray.push(newAuthor)

        fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray))



        response.status(201).send({ id: newAuthor.id })
    } catch (error) {
        next(error)
    }


})


authorsRouter.get("/", (request, response, next) => {

    try {
        const fileContent = fs.readFileSync(authorsJSONPath)
        console.log("FILE CONTENT: ", JSON.parse(fileContent))


        const authorsArray = JSON.parse(fileContent)



        response.send(authorsArray)
    } catch (error) {
        next(error)
    }


})

authorsRouter.get("/downloadCSV", ( req, res, next) => {
    try {

        res.setHeader("Content-Disposition", "attachment; filename=authors.csv")

        const source = getAuthorsReadableStream()
        const transform = new json2csv.Transform({ fields: ["name", "surname", "email", "birthDate", "avatar", "id"] })
        const destination = res
    
        pipeline(source, transform, destination, err => {
          console.log( err)
        })
        
    } catch (error) {
        next(error)
    }
})


authorsRouter.get("/:authorId", (request, response, next) => {

    try {
        console.log("REQ PARAMS: ", request.params.authorId)


        const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))


        const foundAuthor = authorsArray.find(author => author.id === request.params.authorId)


        response.send(foundAuthor)
    } catch (error) {
        next(error)
    }

})


authorsRouter.put("/:authorId", (request, response, next) => {

    try {
        const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))


        const index = authorsArray.findIndex(author => author.id === request.params.authorId)
        const oldAuthor = authorsArray[index]
        const updatedAuthor = { ...oldAuthor, ...request.body }

        authorsArray[index] = updatedAuthor


        fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray))



        response.send(updatedAuthor)
    } catch (error) {
        next(error)
    }


})


authorsRouter.delete("/:authorId", (request, response, next) => {

    try {
        const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))


        const remainingAuthors = authorsArray.filter(author => author.id !== request.params.authorId)


        fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))



        response.status(204).send()
    } catch (error) {
        next(error)
    }


})



export default authorsRouter