import bcrypt from 'bcrypt';

export class Bycrypt{
    static async encrypt(text : string) : Promise<string>{
        const hash : string = await bcrypt.hash(text, 10);
        return hash;
    }
}
