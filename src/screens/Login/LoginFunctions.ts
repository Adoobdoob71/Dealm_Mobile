import * as Firebase from 'firebase';

async function loginWithEmailAndPassword(email : string, password : string){
  let result : Firebase.default.auth.UserCredential = await Firebase.default.auth().signInWithEmailAndPassword(email, password);
  return result;  
}

function goToRegister(){
  
}

export {
  loginWithEmailAndPassword,

}