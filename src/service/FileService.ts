import { Request , Response } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
import { TestModel } from "../db/model/testModel";
import { Product, ProductModel } from "../db/model/productModel";
export class FileService{

    async uploadImage(req : Request, res : Response) {
        
        const dtoResp = new DtoResp;

        console.log(req.file);

        if(!req.file){
            dtoResp.setStatus(HandlerStatus.Failed);
            dtoResp.setMessage("you must select a file");
            return res.status(200).json(dtoResp);
        }

        // const test = new TestModel({
        //     image: {
        //         data: req.file.buffer,
        //         contentType: req.file.mimetype
        //     }
        // });

        const uploadedProduct : Product | null = await ProductModel.findOneAndUpdate(
            { _id : req.body.id },
            { productImage : 
                { 
                    data : req.file.buffer, 
                    contentType : req.file.mimetype
                } 
            },
            { new: true }
        )
        console.log(uploadedProduct);


        // await test.save();
        
        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage('test message');
        return res.status(200).json(dtoResp);

    }

    async getImages(req : Request, res : Response): Promise<Response> {

        const dtoResp = new DtoResp;
        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage('test message');

        const getImage = await TestModel.find({});

        console.log(getImage);

        if(!getImage[0].image.data) {
            return res.status(200).json({ ...dtoResp });
        }

        const base64Data = getImage[0].image.data.toString('base64');

        return res.status(200).json({ ...dtoResp, getImage: base64Data });
        
        
    }
}