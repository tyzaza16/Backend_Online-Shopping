import forge from 'node-forge';



export class NodeForge {
  
  static hashWithSHA258(data: string): string{
    let md = forge.md.sha256.create();
    md.update(data);
    return md.digest().toHex();
  }

}