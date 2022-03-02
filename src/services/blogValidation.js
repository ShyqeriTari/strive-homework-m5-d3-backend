import { body } from "express-validator"

export const newBookValidation = [
  body("title").exists().withMessage("Title is a mandatory field!"),
  body("category").exists().withMessage("Category is a mandatory field!"),
  body("author").exists().withMessage("Category is a mandatory field!"),
  body("content").exists().withMessage("Category is a mandatory field!"),
]