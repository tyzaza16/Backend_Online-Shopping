import { controller, get, post, use } from "./decorators";
import { Request, Response } from "express"; 
import { FileService } from "../service/FileService";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { DB_URI } from "../utils/loadEnvirontment";
const storage = new GridFsStorage({
    url: DB_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        console.log("mimetype : " + file.mimetype)
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-${file.originalname}`,
        };
    },
});

@controller('/file')
class FileController{

    @get('/:filename')
    getImage(req: Request, res : Response){
        const fileService = new FileService();
        fileService.getImage(req, res);
    }

    @post('/upload')
    @use(multer({storage}).single("file"))
    uploadImage(req : Request, res : Response) {
        const fileService = new FileService();
        fileService.uploadImage(req, res);
    }
    
}