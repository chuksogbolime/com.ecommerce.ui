
export class Customer{

    constructor(
        public name:string,
        public lastName: string,
        public street: string,
        public houseNumber: string,
        public phone: string,
        public id:Number
   ){}

}
export const EmptyCustomer:Customer = new Customer('','','','','',-1);
export const MockCustomer:Customer[]=[
    new Customer("Jone", "Doe", "Henry frame street", "20", "01234555", 1),
    new Customer("Paul", "Sprin", "Smith Coal street", "2", "09876544", 2),
    new Customer("Jone", "Doe", "Henry frame street", "20", "01234555", 1),
    new Customer("Jone", "Doe", "Henry frame street", "20", "01234555", 1),
    new Customer("Jone", "Doe", "Henry frame street", "20", "01234555", 1),
    new Customer("Jone", "Doe", "Henry frame street", "20", "01234555", 1),
    new Customer("Jone", "Doe", "Henry frame street", "20", "01234555", 1),
    new Customer("Jone", "Doe", "Henry frame street", "20", "01234555", 1),
    new Customer("Jone", "Doe", "Henry frame street", "20", "01234555", 1),
    new Customer("Jone", "Doe", "Henry frame street", "20", "01234555", 1),
]
