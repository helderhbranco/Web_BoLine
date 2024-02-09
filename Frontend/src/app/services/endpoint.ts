export class BackendURL {
   private base = 'http://localhost:3000/api';
   private version = '/v1';
   
   public url = `${this.base}${this.version}`;
};