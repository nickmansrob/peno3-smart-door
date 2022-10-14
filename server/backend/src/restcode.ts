//code for alternate handle Face

const tot: number = tokens.length
let b: number 
let index: number 
  
for (let i = 0; i < tot; i= i +1 ){
  const a = euclidDistance(req, tokens[i])
  if (i === 0)
    b = a
  else
  if (a < b){
    b = a 
    index= i}
  //return [index, b]
}
    

