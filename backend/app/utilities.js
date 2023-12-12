import bcrypt from 'bcrypt';

export const hashPassword = async (password) =>{
    const hash = await bcrypt.hash(password, parseInt(process.env.HASH_ITERATION));
    return hash;
}

export const hashMatch = async (password, hash) =>{
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}