
import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import cors from "cors"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { newBlogValidation } from "./blogValidation.js"
import { newCommentValidation } from "./commentValidation.js"
import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_KEY)

const sendRegistrationEmail = async recipientAddress => {
    const msg = {
        to: recipientAddress,
        from: process.env.SENDER_EMAIL,
        subject: "Strive new post created",
        text: "You have successfully created a new blog post",
        html: "<strong>You have successfully created a new blog post</strong>",
    }

    await sgMail.send(msg)
}

const blogsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogs.json")
const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath))
const writeBlogs = content => fs.writeFileSync(blogsJSONPath, JSON.stringify(content))

const blogsRouter = express.Router()

blogsRouter.post("/", newBlogValidation, (request, response, next) => {


    try {
        const blogsArray = getBlogs()
        const errorGroup = validationResult(request)
        if (errorGroup.isEmpty()) {
            const newBlog = { id: uniqid(), ...request.body, createdAt: new Date(), comments: [] }

            blogsArray.push(newBlog)

            writeBlogs(blogsArray)

            response.status(201).send({ newBlog })
        } else {

            next(createHttpError(400, "Some errors occurred in req body", { errorGroup }))
        }
    } catch (error) {
        next(error)
    }

})

blogsRouter.post("/blogPosts/:id/comments", newCommentValidation, (request, response, next) => {

    try {
        const blogsArray = getBlogs()
        const errorGroup = validationResult(request)

        if (errorGroup.isEmpty()) {
            const index = blogsArray.findIndex(blog => blog.id === request.params.id)

            const blog = blogsArray[index]

            const blogComment = blogsArray[index].comments

            const newComment = { ...request.body }

            blogComment.push(newComment)

            writeBlogs(blogsArray)

            response.status(201).send({ blog })
        } else {

            next(createHttpError(400, "Some errors occurred in req body", { errorGroup }))
        }

    } catch (error) {
        next(error)
    }

})


blogsRouter.get("/", (request, response, next) => {

    try {
        const blogsArray = getBlogs()
        response.send(blogsArray)

    } catch (error) {
        next(error)
    }

})




blogsRouter.get("/:blogId", (request, response, next) => {
    try {
        const blogsArray = getBlogs()
        const foundBlog = blogsArray.find(blog => blog.id === request.params.blogId)

        response.send(foundBlog)

    } catch (error) {
        next(error)
    }


})

blogsRouter.get("/blogPosts/:id/comments", (request, response, next) => {
    try {
        const blogsArray = getBlogs()
        const foundBlog = blogsArray.find(blog => blog.id === request.params.id)

        const foundBlogComments = foundBlog.comments

        response.send(foundBlogComments)

    } catch (error) {
        next(error)
    }


})


blogsRouter.put("/:blogId", newBlogValidation, (request, response, next) => {
    try {
        const blogsArray = getBlogs()
        const errorGroup = validationResult(request)
        if (errorGroup.isEmpty()) {
            const index = blogsArray.findIndex(blog => blog.id === request.params.blogId)
            const oldBlog = blogsArray[index]
            const updatedBlog = { ...oldBlog, ...request.body }

            blogsArray[index] = updatedBlog


            writeBlogs(blogsArray)

            response.send(updatedBlog)
        } else {
            next(createHttpError(400, "Some errors occurred in req body", { errorGroup }))
        }

    } catch (error) {
        next(error)
    }

})


blogsRouter.delete("/:blogId", (request, response, next) => {

    try {
        const blogsArray = getBlogs()


        const remainingBlogs = blogsArray.filter(blog => blog.id !== request.params.blogId)
        fs.writeFileSync(blogsJSONPath, JSON.stringify(remainingBlogs))

        response.status(204).send()


    } catch (error) {
        next(error)
    }


})

blogsRouter.post("/registerEmail", async (req, res, next) => {
    try {
        const { email } = req.body

        await sendRegistrationEmail(email)
        res.send()

    } catch (error) {
        next(error)
    }
})

export default blogsRouter