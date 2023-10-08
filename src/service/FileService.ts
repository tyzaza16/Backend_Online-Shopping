import { Request , Response } from "express";
import { DtoResp } from "../common/model/DataObjResp";
import { HandlerStatus } from "../Constant";
import { SERVER_PORT } from "../utils/loadEnvirontment";
import Grid from 'gridfs-stream';
import mongoose from "mongoose";
import { GridFSBucket, MongoClient } from "mongodb";
import { DB_URI } from "../utils/loadEnvirontment";
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
        if(req.file === undefined){
            dtoResp.setStatus(HandlerStatus.Failed);
            dtoResp.setMessage("you must select a file");
            return res.status(200).json(dtoResp);
        }
        console.log(req.file);
        const imgUrl = `http://localhost:${SERVER_PORT}/file/${req.file.filename}`
        dtoResp.setStatus(HandlerStatus.Success);
        dtoResp.setMessage(imgUrl);
        return res.status(200).json(dtoResp);

    }
}