export class User {
    constructor( 
      public email: string,
      public password: string,
      public _id?: string,
      public name?: string,
      public status = true,
      public role = 'USER'
    ) { }
  }
  