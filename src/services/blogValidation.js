import { body } from "express-validator"

export const newBlogValidation = [
  body("title").exists().withMessage("Title is a mandatory field!"),
  body("category").exists().withMessage("Category is a mandatory field!"),
  body("author").exists().withMessage("Author is a mandatory field!"),
  body("content").exists().withMessage("Content is a mandatory field!"),
  body("cover").exists().withMessage("Cover is a mandatory field!"),
]