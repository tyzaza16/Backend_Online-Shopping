import { controller, get, post, use } from "./decorators";
import { NextFunction, Request, RequestHandler, Response } from "express"; 
import { FileService } from "../service/FileService";
import multer, { Multer } from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { DB_URI } from "../utils/loadEnvirontment";

// const storage = new GridFsStorage({
//     url: DB_URI,
//     file: (req: Request , file: any) => {
//         console.log("mimetype : " + file.mimetype)

//         const match = ["image/png", "image/jpeg"];

//         console.log(req.file);

//         if (match.indexOf(file.mimetype) === -1) {
//             const filename = `${Date.now()}-${file.originalname}`;
//             return filename;
//         }

//         console.log(file);
//         return {
//             bucketName: "photos",
//             filename: `${Date.now()}-${file.originalname}`,
//         };
//     },
// });

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
        console.log(req.file)
        fileService.uploadImage(req, res);
    }

    @get('/images')
    getImages(req: Request, res: Response): Promise<Response> {
        console.log('test')
        const fileService = new FileService();
        return fileService.getImages(req, res);
    }

    
}