var i =1
var o = {}
o[i] = "a"
console.log(o)


var p=[]
p.push({[i]:[]})
console.log(3)

var str = "2013-03-04"
console.log( parseInt(str.substr(5,2) )   )
//************************* */
let pets = [{"":"Cat"}, {"b":["Dog", "Hamster"]}];
pets["species"] = "mammals";

for (let pet in pets) {
   console.log(pet); // "species"
}

// for (let pet of pets) {
//     console.log(pet); // "Cat", "Dog", "Hamster"
// }


var a = '2022-3-4'
b=a.substr(0,4)
console.log(b)