
   
import express from "express"
import multer from "multer"
import { saveAuthorsPictures, saveBlogsPictures } from "../../lib/fs-tools.js"

const filesRouter = express.Router()

filesRouter.post("/:id/uploadAvatar", multer().single("avatar"), async (req, res, next) => {
  try {
    await saveAuthorsPictures(req.file.originalname, req.file.buffer)
    res.send()
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/:id/uploadCover", multer().single("cover"), async (req, res, next) => {
    try {
      await saveBlogsPictures(req.file.originalname, req.file.buffer)
      res.send()
    } catch (error) {
      next(error)
    }
  })

export default filesRouter