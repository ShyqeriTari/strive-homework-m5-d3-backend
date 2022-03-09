import { body } from "express-validator"


export const newBlogValidation = [
  body("title").notEmpty().withMessage("Title is a mandatory field!"),
  body("category").notEmpty().withMessage("Category is a mandatory field!"),
  body("author").notEmpty().withMessage("Author is a mandatory field!"),
  body("content").notEmpty().withMessage("Content is a mandatory field!"),
  body("cover").notEmpty().withMessage("Cover is a mandatory field!"),
]