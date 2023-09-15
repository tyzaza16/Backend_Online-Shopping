import forge from 'node-forge';



export class NodeForge {
  
  static hashWithSHA258(data: string): string{
    let md = forge.md.sha256.create();
    md.update(data);
    return md.digest().toHex();
  }

  static encryptAES(text : string){
        const key = "zBVphfnky3bAA1xI";
        const iv = "q4xO8KYSoZKZeiij"
        console.log("random : " , forge.random.getBytesSync(16));
        const cipher = forge.cipher.createCipher('AES-CBC', key);
        cipher.start({iv: iv});
        cipher.update(forge.util.createBuffer(text));
        cipher.finish();
        const encrypted = cipher.output;
        console.log("encrypted : ", encrypted.toHex());
  }
}