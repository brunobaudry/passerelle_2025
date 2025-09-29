// console.log('Hello Passerelle !');

let myVar = 'hello';
//let name = 'Bobo';
let number = 0.1;

function helloAll(){
    let myVar1 = 'buddy';
    // This here is hello's parent/global scope
    // console.log(myVar, this);
}
helloAll();
// console.log(myVar, myVar1);

const helloMe= ()=>{
    // This here is hello's scope
    // console.log(myVar, this);
}
helloMe();

// Arrays and object are ref
// Objects
const person ={
    age: 57,
    name: 'Bruno',
    greet(){
        // this is in the object scope when the function is declared as is
        // console.log('Hello I am '+ this.name);
    },
    greetMe: ()=>{
        // Cannot access this in arrow function.
        // console.log('Me, I am also '+ this.name);
    },
    greetOk: function(){
        // Can access this in anonymous function.
        // console.log('Ok, Hello I am also '+ this.name);
    }
}
person.greet();
person.greetMe();
person.greetOk();
//console.log(helloAll());
//console.log(helloMe());


const myHobbies = ['Sleeping','eating'];
// console.log(myHobbies);
for(let i=0; i < myHobbies.length; i++){
    // console.log(i, myHobbies[i]);
}
const myClone = myHobbies;
const copyArray = myHobbies.slice();
// console.log(myHobbies, myClone, copyArray);
// myHobbies.push('computers'); // Altering the ref
// console.log(person);
const person2 = {...person};
const person3 = person;
person.age++;
// console.log(person);
// console.log(person2);
// console.log(person3);

const cloneArray2 = [...myHobbies];
myClone.push('Teaching');
// console.log(myHobbies);
// console.log(myClone);
// console.log(cloneArray2);
// console.log(cloneArray); // cloned before push
// console.log(cloneArray2); // cloned after push

// Rest operator (flexible func args)
const flex=(...args)=>{
    return args;
}
// console.log( flex(1,2,3,4, 'yo') );

// Object destructuring
// Old way
const printName = (someone)=>{
    // console.log(someone.name);
}
// Object destructuring way
const printNameDifferently = ( {name} ) =>{
    // console.log(name);
}
// printName(person);
// printNameDifferently(person);

const {name, age} = person;
console.log(name, age);

// Array destructuring
const [hoby1, hobbie2] = myHobbies;
console.log(myHobbies);
console.log(hoby1, hobbie2);