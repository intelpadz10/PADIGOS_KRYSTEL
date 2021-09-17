export class User{
    private id: number;
    private name: string;
    private age: number;
    private email: string;
    private password: string;
    
    constructor(id:number, name:string, age:number, email:string, password: string){
      this.id=id;
      this.name=name;
      this.age=age;
      this.email=email;
      this,password=password;
    }
    
    log(){
      console.log('${this.name} | age: ${this.age} | email: ${this.email}');
    }
    
    login(email:string, password:string){
        if(this.email == email && this.password == password){
            return true;
        }else 
            false;
    }
    
    toJson(){
      return {
        id: this.id,
        name: this.name,
        age: this.age,
        email: this.email
      }
    }
  }