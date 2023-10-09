import { Request , Response } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
import { SERVER_PORT } from "../utils/loadEnvirontment";
import Grid from 'gridfs-stream';
import mongoose from "mongoose";
import { GridFSBucket, MongoClient } from "mongodb";
import { DB_URI } from "../utils/loadEnvirontment";
import { TestModel } from "../db/model/testModel";
export class FileService{

    async getImage(req : Request, res : Response){
        // const dtoResp = new DtoResp;
        // let gfs;
        // const conn = mongoose.connection;
        // conn.once("open", function () {
        //     gfs = Grid(conn.db, mongoose.mongo);
        //     gfs.collection("photos");
        // });
        // try {
        //     const file = await gfs.files.findOne({ filename: req.params.filename });
        //     const readStream = gfs.createReadStream(file.filename);
        //     readStream.pipe(res);
        // } catch (error) {
        //     dtoResp.setStatus(HandlerStatus.Failed);
        //     dtoResp.setMessage("Image not found");
        //     return res.status(200).json(dtoResp);
        // }
        
    }
    async uploadImage(req : Request, res : Response) {
        
        const dtoResp = new DtoResp;

        console.log(req.file);

        if(!req.file){
            dtoResp.setStatus(HandlerStatus.Failed);
            dtoResp.setMessage("you must select a file");
            return res.status(200).json(dtoResp);
        }

        const test = new TestModel({
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        await test.save();
        
        // const imgUrl = `http://localhost:${SERVER_PORT}/file/${req.file.filename}`
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