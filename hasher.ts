import bcrypt, { hash } from 'bcrypt';

const SALT = 10;


 const  generateHash = async (password : string)  => {

    let hashedPassword =  await bcrypt.hash(password,SALT);
    console.log(hashedPassword);

   
    return hashedPassword;




}

export default generateHash;