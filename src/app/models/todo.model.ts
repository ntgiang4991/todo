export class Todo{
    // id: number;// timestamp
    // content: string;
    // isCompleted: boolean;

    // constructor(id: number, content: string){
    //     id;
    //     content;
    //     this.isCompleted = false;
    // }

    // Cách viết 2
    constructor(
        public id: number, 
        public content: string, 
        public isCompleted: boolean = false
    ){}
}