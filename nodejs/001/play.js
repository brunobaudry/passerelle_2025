let myVar = 'hello';
//let name = 'Bobo';
let number = 0.1;

function helloAll(){
    let myVar1 = 'buddy';
    // This here is hello's parent/global scope
    console.log(myVar, myVar1, this);
}
const helloMe=()=>{
    // This here is hello's scope
    console.log(myVar, this);
}

// Arrays and object are ref
const myHobbies = ['Sleeping','eating'];
// Objects
const person ={
    age: 56,
    name: 'Bruno',
    greet(){
        // this is in the object scope when the function is declared as is
        console.log('Hello I am '+ this.name);
    },
    greetMe: ()=>{
        // Cannot access this in arrow function.
        console.log('Hello I am also '+ this.name);
    },
    greetOk: function(){
        // Cannot access this in arrow function.
        console.log('Hello I am also '+ this.name);
    }
}
person.greet();
person.greetOk();
person.greetMe();
//console.log(helloAll());
//console.log(helloMe());
console.log(myHobbies);
const cloneArray = myHobbies.slice();
myHobbies.push('computers'); // Altering the ref
console.log(person);
const person2 = {...person};
person.age++;
console.log(person);
console.log(person2);

const cloneArray2 = [...myHobbies];
console.log(myHobbies);
console.log(cloneArray); // cloned before push
console.log(cloneArray2); // cloned after push

// Rest operator (flexible func args)
const flex=(...args)=>{
    return args;
}
console.log(flex(1,2,3,4));

// Object destructuring
// Old way
const printName = (someone)=>{
    console.log(someone.name);
}
// Object destructuring way
const printNameDifferently = ( {name} ) =>{
    console.log(name);
}
printName(person);
printNameDifferently(person);

const {name, age} = person;
console.log(name, age);

// Array destructuring
 
const [hoby1, hobbie2] = myHobbies;
console.log(hoby1, hobbie2);