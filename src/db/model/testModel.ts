import mongoose, { HydratedDocument, InferSchemaType, Model, Schema } from "mongoose";


const testSchema = new Schema({
  image: {type: { data: Buffer, contentType: String}, required: true }
});

type TestSchema = InferSchemaType<typeof testSchema>;

const TestModel: Model<TestSchema> = mongoose.model('test', testSchema);

export {
  TestModel, 
  TestSchema
}