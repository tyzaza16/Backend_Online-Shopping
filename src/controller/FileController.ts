import { controller, get, post, use } from "./decorators";
import { NextFunction, Request, RequestHandler, Response } from "express"; 
import { FileService } from "../service/FileService";
import multer, { Multer } from "multer";

const storage = multer.memoryStorage();

const upload: Multer = multer({ storage: storage });

const uploadSingle: RequestHandler = upload.single('avatar');

// function uploadingFile(req: Request, res: Response, next: NextFunction) {
//     const upload = multer({ storage: storage }).single("avatar");

//     // upload(req, res, function (err) {
//     //     console.log(req.file)
//     //     if (err) {
//     //         // Handle the error
//     //         return res.status(500).json({ error: "File upload failed" });
//     //     }
//     //     next();
//     // });
//     multer({ storage: storage }).single("avatar");
//     console.log(req.file)
//     next();
// }

@controller('/file')
class FileController{

    // @get('/:filename')
    // getImage(req: Request, res : Response){
    //     const fileService = new FileService();
    //     fileService.getImage(req, res);
    // }

    @post('/upload')
    @use( uploadSingle )
    uploadImage(req: Request, res: Response) {
        const fileService = new FileService();
        fileService.uploadImage(req, res);
    }

    @get('/images')
    getImages(req: Request, res: Response): Promise<Response> {
        const fileService = new FileService();
        return fileService.getImages(req, res);
    }

    
}