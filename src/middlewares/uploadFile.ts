import { NextFunction, Request, Response } from "express";
import multer = require("multer");

export default new (class UploadFile {
  Upload(fieldName: string) {
    const storage = multer.diskStorage({
      destination: (req, res, cb) => {
        cb(null, "src/uploads");
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.fieldname}.png`);
      },
    });

    const uploadFile = multer({
      storage: storage,
    });

    return (req: Request, res: Response, next: NextFunction) => {
      uploadFile.single(fieldName)(req, res, function (err: any) {
        if (err) {
          return res.status(400).json({ Error: `${err}` });
        }
        if (req.file) {
          res.locals.filename = req.file.filename;
        }
        next();
      });
    };
  }
})();
