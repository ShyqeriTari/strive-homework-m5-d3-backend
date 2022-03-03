import { body } from "express-validator"

export const newCommentValidation = [
  body("author").notEmpty().withMessage("Author is a mandatory field!"),
  body("text").notEmpty().withMessage("Text is a mandatory field!"),
]