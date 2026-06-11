import bcrypt from 'bcryptjs';
import db from "../models/index";
import { raw } from 'body-parser';
const salt = bcrypt.genSaltSync(10);


let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashpasswordfrombcrypt = await hashUserPassword(data.password);
            await db.Users.create({
                email: data.email,
                password: hashpasswordfrombcrypt,
                firstName: data.firstname,
                lastName: data.lastname,
                address: data.address,
                phoneNumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
              
            })
            resolve('CREATE A NEW USER SUCDEEED !!!');
        } catch (e) {
            reject(e);
        }
    })

}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashpassword = await bcrypt.hashSync(password, salt);
            resolve(hashpassword);
        } catch (e) {
            reject(e);
        }
    })
}


let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.Users.findAll({
                raw: true,
            });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let getUserInfoById = (userid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: {
                    id: userid
                },
                raw: true,
            })
            if (user) {
                resolve(user)
            }
            else {
                resolve([])
            }
        } catch (e) {
            reject(e);
        }
    })
}


let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: { id: data.id }
            })
            if (user) {
                user.firstName = data.firstname;
                user.lastName = data.lastname;
                user.address = data.address;

                await user.save();
                let allusers = await db.Users.findAll();
                resolve(allusers);
            }
            else {
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: { id: userId }
            })
            if (user) {
                await user.destroy();
            }
            resolve(); 
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById
}