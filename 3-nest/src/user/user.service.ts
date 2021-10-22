import * as admin from 'firebase-admin';

import { debug, log } from 'console';

import { CRUDReturn } from './user.resource/crud_return.interface';
import { Helper } from './user.resource/helper';
import { Injectable } from '@nestjs/common';
import { User } from './user.resource/user.model';
import { doc } from 'prettier';
import { resourceLimits } from 'worker_threads';

const DEBUG: boolean = true;

@Injectable()
export class UserService {
    private users: Map<string, User> = new Map<string, User>();
    private DB = admin.firestore();

    constructor() {
        this.users = Helper.populate();
    }

    logAllUser() {
        for (const [key, user] of this.users.entries()) {
            console.log(key);
            user.log();
        }
    }

    async getAll(): Promise<CRUDReturn> {
        var results: Array<any> = [];
        try {
            var allUsers = await this.getAllUserObejcts();
            allUsers.forEach((user) => {
                results.push(user.toJson());
                console.log(user.toJson());
            });
            return {
                success: true,
                data: results,
            };
        } catch (error) {
            return {
                success: false,
                data: error,
            };
        }
    }

    async getAllUserObejcts(): Promise<Array<User>> {
        var results: Array<User> = [];
        try {
            var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
                await this.DB.collection('users').get();
            dbData.forEach((doc) => {
                if (doc.exists) {
                    var data = doc.data();
                    results.push(
                        new User(
                            data['name'],
                            data['age'],
                            data['email'],
                            data['password'],
                            doc.id,
                        ),
                    );
                }
            });
            return results;
        } catch (e) {
            return null;
        }
    }

    // getAll(): CRUDReturn
    // {
    //     var populatedData = [];
    //         for(const body of this.users.values())
    //         {
    //             populatedData.push(body.toJson());
    //         }
    //         if (populatedData.length > 0){
    //             return{
    //                 success: true,
    //                 data: populatedData
    //             }
    //         } else
    //             return {
    //                 success: false,
    //                 data: "There is no information in the database."
    //             }
    // };

    async register(user: any): Promise<CRUDReturn> {
        try {
            var validBodyPut: { valid: boolean; data: string } =
                Helper.validBodyPut(user);
            if (validBodyPut.valid) {
                var exists = await this.emailExists(user.email);
                if (!exists) {
                    var newUser: User;
                    newUser = new User(
                        user?.name,
                        user?.age,
                        user?.email,
                        user?.password,
                    );
                    if (await this.savetoDB(newUser)) {
                        if (debug) this.getAll();
                        console.log(newUser.toJson());
                        return {
                            success: true,
                            data: newUser.toJson(),
                        };
                    } else {
                        throw new Error('generic database error');
                    }
                } else
                    throw new Error(`${user.email} is already in use by another user!`);
            } else {
                throw new Error(validBodyPut.data);
            }
        } catch (error) {
            console.log(error.message);
            return { success: false, data: `Error adding account, ${error.message}` };
        }
    }

    async getInfo(id: string): Promise<CRUDReturn> {
        try {
            var result = await this.DB.collection('users').doc(id).get();
            if (result.exists) {
                return {
                    success: true,
                    data: result.data(),
                };
            } else {
                return {
                    success: false,
                    data: `User ${id} does not exist in databse`,
                };
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                data: error,
            };
        }
        //for(const i of this.users.values())
        //{
        //if (i.toJson().id == id)
        //{
        //return{
        //success: true,
        //data: [i.toJson()]
        //}
        //}
        //}
        //return {
        //success: false,
        //data: "This ID does not exist in the database."
        //}
    }

    async searchUser(term: string): Promise<CRUDReturn> {
        try {
            var storeData: Array<any> = [];
            var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
                await this.DB.collection('users').get();
            dbData.forEach((doc) => {
                if (
                    term == doc.data()['id'] ||
                    term == doc.data()['name'] ||
                    term == doc.data()['age'] ||
                    term == doc.data()['email']
                ) {
                    storeData.push(doc.data());
                }
            });
            if (storeData.length > 0) {
                return {
                    success: true,
                    data: storeData,
                };
            } else {
                return {
                    success: false,
                    data: `${term} does not match any users in database!`,
                };
            }
        } catch (error) {
            return {
                success: false,
                data: `${term} does not match any users in database!`,
            };
        }
    }

    async replaceAllPut(user: any, id: string): Promise<CRUDReturn> {
        try {
            var validBodyPut: { valid: boolean; data: string } =
                Helper.validBodyPut(user);
            var dbData = await this.DB.collection('users').doc(id).get();

            if (validBodyPut.valid) {
                if (this.idExists(id)) {
                    var exists = await this.emailExists(user.email);
                    if (!exists || user.email == dbData.data()['email']) {
                        await this.DB.collection('users')
                            .doc(id)
                            .update({
                                name: user.name,
                                age: user.age,
                                email: user.email,
                                password: user.password,
                            });
                        if (dbData.exists) {
                            return {
                                success: true,
                                data: dbData.data(),
                            };
                        }
                    } else {
                        return {
                            success: false,
                            data: `${user.email} is already in use by another user!`,
                        };
                    }
                }
                throw new Error(`user does not exist in database.`);
            } else {
                throw new Error(validBodyPut.data);
            }
        } catch (error) {
            return { success: false, data: `${error.message}` };
        }
    }

    // async replaceValuesPatch(user: any, id: string): Promise<CRUDReturn> {
    //     var validBody: { valid: boolean; data: string } = Helper.validBody(user);
    //     var count: number = this.countFunction(user, count);
    //     var firstUser: User = this.users.get(id);
    //     var secondUser: User;

    //     try {
    //         if (validBody.valid) {
    //             for (const newUser of this.users.values()) {
    //                 console.log('Success');
    //                 if (id == newUser.toJson().id) {
    //                     if (!this.emailExists(user?.email)) {
    //                         switch (count) {
    //                             case 1:
    //                                 if (user.name != undefined) {
    //                                     secondUser = new User(
    //                                         user.name,
    //                                         firstUser.toJson().age,
    //                                         firstUser.toJson().email,
    //                                         firstUser.toJsonPass().password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 if (user.age != undefined) {
    //                                     secondUser = new User(
    //                                         firstUser.toJson().name,
    //                                         user.age,
    //                                         firstUser.toJson().email,
    //                                         firstUser.toJsonPass().password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 if (user.email != undefined) {
    //                                     secondUser = new User(
    //                                         firstUser.toJson().name,
    //                                         firstUser.toJson().age,
    //                                         user.email,
    //                                         firstUser.toJsonPass().password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 if (user.password != undefined) {
    //                                     secondUser = new User(
    //                                         firstUser.toJson().name,
    //                                         firstUser.toJson().age,
    //                                         user.email,
    //                                         user.password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 return {
    //                                     success: true,
    //                                     data: firstUser.toJson(),
    //                                 };
    //                                 break;

    //                             case 2:
    //                                 if (user.name != undefined && user.age != undefined) {
    //                                     secondUser = new User(
    //                                         user.name,
    //                                         user.age,
    //                                         firstUser.toJson().email,
    //                                         firstUser.toJsonPass().password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 if (user.name != undefined && user.email != undefined) {
    //                                     secondUser = new User(
    //                                         firstUser.toJson().name,
    //                                         firstUser.toJson().age,
    //                                         user.email,
    //                                         firstUser.toJsonPass().password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 if (user.name != undefined && user.password != undefined) {
    //                                     secondUser = new User(
    //                                         firstUser.toJson().name,
    //                                         firstUser.toJson().age,
    //                                         firstUser.toJson().email,
    //                                         user.password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 if (user.age != undefined && user.email != undefined) {
    //                                     secondUser = new User(
    //                                         firstUser.toJson().name,
    //                                         user.age,
    //                                         user.email,
    //                                         firstUser.toJsonPass().password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 if (user.age != undefined && user.password != undefined) {
    //                                     secondUser = new User(
    //                                         firstUser.toJson().name,
    //                                         user.age,
    //                                         firstUser.toJson().email,
    //                                         user.password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 if (user.email != undefined && user.password != undefined) {
    //                                     secondUser = new User(
    //                                         firstUser.toJson().name,
    //                                         user.age,
    //                                         user.email,
    //                                         user.password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 return {
    //                                     success: true,
    //                                     data: firstUser.toJson(),
    //                                 };
    //                                 break;

    //                             case 3:
    //                                 if (
    //                                     user.name != undefined &&
    //                                     user.age != undefined &&
    //                                     user.email != undefined
    //                                 ) {
    //                                     secondUser = new User(
    //                                         user.name,
    //                                         user.age,
    //                                         user.email,
    //                                         firstUser.toJsonPass().password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 if (
    //                                     user.name != undefined &&
    //                                     user.age != undefined &&
    //                                     user.password != undefined
    //                                 ) {
    //                                     secondUser = new User(
    //                                         user.name,
    //                                         user.age,
    //                                         firstUser.toJson().email,
    //                                         user.password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 if (
    //                                     user.name != undefined &&
    //                                     user.email != undefined &&
    //                                     user.password != undefined
    //                                 ) {
    //                                     secondUser = new User(
    //                                         user.name,
    //                                         firstUser.toJson().age,
    //                                         user.email,
    //                                         user.password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 if (
    //                                     user.age != undefined &&
    //                                     user.email != undefined &&
    //                                     user.password != undefined
    //                                 ) {
    //                                     secondUser = new User(
    //                                         firstUser.toJson().name,
    //                                         user.age,
    //                                         user.email,
    //                                         firstUser.toJsonPass().password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 return {
    //                                     success: true,
    //                                     data: firstUser.toJson(),
    //                                 };
    //                                 break;
    //                             case 4:
    //                                 if (
    //                                     user.name != undefined &&
    //                                     user.age != undefined &&
    //                                     user.email != undefined &&
    //                                     user.password != undefined
    //                                 ) {
    //                                     secondUser = new User(
    //                                         user.name,
    //                                         user.age,
    //                                         user.email,
    //                                         user.password,
    //                                     );
    //                                     this.users.set(id, secondUser);
    //                                     this.users.get(id).newID(id);
    //                                     firstUser = secondUser;
    //                                 }
    //                                 return {
    //                                     success: true,
    //                                     data: firstUser.toJson(),
    //                                 };
    //                                 break;
    //                         }
    //                     } else
    //                         throw new Error(
    //                             `${user.email} exists in database that is not of the current user.`,
    //                         );
    //                 }
    //             }
    //             throw new Error('User not found!');
    //         } else {
    //             throw new Error(validBody.data);
    //         }
    //     } catch (error) {
    //         return { success: false, data: `${error.message}` };
    //     }
    // }

    async replaceValuesPatch(user: any, id: string): Promise<CRUDReturn> {
        var validBody: { valid: boolean; data: string } = Helper.validBody(user);
        var count: number = this.countFunction(user, count);
        var dbData = await this.DB.collection('users').doc(id).get();

        try {
            if (validBody.valid) {
                if (this.idExists(id)) {
                    var exists = await this.emailExists(user?.email);
                    if (!exists || user.email == dbData.data()['email']) {
                        switch (count) {
                            case 1:
                                if (user.name != undefined) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({ name: user.name });
                                }
                                if (user.age != undefined) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({ age: user.age });
                                }
                                if (user.email != undefined) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({ email: user.email });
                                }
                                if (user.password != undefined) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({ password: user.password });
                                }
                                var anotherdata = (
                                    await this.DB.collection('users').doc(id).get()
                                ).data();
                                console.log(anotherdata);
                                return {
                                    success: true,
                                    data: anotherdata,
                                };
                                break;

                            case 2:
                                if (user.name != undefined && user.age != undefined) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({ name: user.name, age: user.age });
                                }
                                if (user.name != undefined && user.email != undefined) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({ name: user.name, email: user.email });
                                }
                                if (user.name != undefined && user.password != undefined) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({ name: user.name, password: user.password });
                                }
                                if (user.age != undefined && user.email != undefined) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({ age: user.age, email: user.email });
                                }
                                if (user.age != undefined && user.password != undefined) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({ age: user.age, password: user.password });
                                }
                                if (user.email != undefined && user.password != undefined) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({ email: user.email, password: user.password });
                                }
                                var anotherdata = (
                                    await this.DB.collection('users').doc(id).get()
                                ).data();
                                console.log(anotherdata);
                                return {
                                    success: true,
                                    data: anotherdata,
                                };
                                break;

                            case 3:
                                if (
                                    user.name != undefined &&
                                    user.age != undefined &&
                                    user.email != undefined
                                ) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({
                                            name: user.name,
                                            age: user.age,
                                            email: user.email,
                                        });
                                }
                                if (
                                    user.name != undefined &&
                                    user.age != undefined &&
                                    user.password != undefined
                                ) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({
                                            name: user.name,
                                            age: user.age,
                                            password: user.password,
                                        });
                                }
                                if (
                                    user.name != undefined &&
                                    user.email != undefined &&
                                    user.password != undefined
                                ) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({
                                            name: user.name,
                                            email: user.email,
                                            password: user.password,
                                        });
                                }
                                if (
                                    user.age != undefined &&
                                    user.email != undefined &&
                                    user.password != undefined
                                ) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({
                                            age: user.age,
                                            email: user.email,
                                            password: user.password,
                                        });
                                }
                                var anotherdata = (
                                    await this.DB.collection('users').doc(id).get()
                                ).data();
                                console.log(anotherdata);
                                return {
                                    success: true,
                                    data: anotherdata,
                                };
                                break;
                            case 4:
                                if (
                                    user.name != undefined &&
                                    user.age != undefined &&
                                    user.email != undefined &&
                                    user.password != undefined
                                ) {
                                    await this.DB.collection('users')
                                        .doc(id)
                                        .update({
                                            name: user.name,
                                            age: user.age,
                                            email: user.email,
                                            password: user.password,
                                        });
                                }
                                var anotherdata = (
                                    await this.DB.collection('users').doc(id).get()
                                ).data();
                                console.log(anotherdata);
                                return {
                                    success: true,
                                    data: anotherdata,
                                };
                                break;
                        }
                    } else throw new Error(`${user.email} does not exist in database.`);
                }
                throw new Error('User not found!');
            } else {
                throw new Error(validBody.data);
            }
        } catch (error) {
            return { success: false, data: `${error.message}` };
        }
    }

    async deleteUser(id: string): Promise<CRUDReturn> {
        if (this.users.has(id)) {
            var result = await this.DB.collection('users').doc(id).delete();
            console.log(result);
            return {
                success: true,
                data: 'data has been deleted',
            };
        } else
            return {
                success: false,
                data: 'not deleted',
            };
    }

    async loginUser(body: any): Promise<CRUDReturn> {
        try {
            var userResult = await this.DB.collection('users')
                .where('email', '==', body.email)
                .get();
            var dbData = await this.DB.collection('users').get();
            var returnUser: Array<any> = [];
            if (!userResult.empty) {
                dbData.forEach((doc) => {
                    if (doc.data()['password'] == body.password) {
                        console.log(doc.data()['email'], doc.data()['password']);
                        returnUser.push(
                            doc.data()['name'],
                            doc.data()['email'],
                            doc.data()['age'],
                            doc.data()['password'],
                        );
                    }
                });
            } else {
                return {
                    success: false,
                    data: 'Login Credentials does not match any users in the database.',
                };
            }
            console.log(returnUser.length);
            if (returnUser.length > 0) {
                return {
                    success: true,
                    data: returnUser,
                };
            } else {
                return {
                    success: false,
                    data: 'Login Credentials does not match any users in the database.',
                };
            }
        } catch (error) {
            return {
                success: false,
                data: error.message,
            };
        }
    }

    async emailExists(email: string): Promise<boolean> {
        var userResults = await this.DB.collection('users')
            .where('email', '==', email || '')
            .get();
        console.log(userResults.size);
        if (userResults.size > 0) {
            for (const doc of userResults.docs) {
                if (doc.data()['email'] === email) {
                    return true;
                }
            }
        } else {
            return false;
        }
    }

    // async emailExists(email: string, options?: { exceptionId: string }): Promise<boolean> {
    //     try {
    //         var userResults = await this.DB.collection("users")
    //             .where("email", "==", email)
    //             .get();
    //         console.log("Are the user results empty?");
    //         console.log(userResults.empty);
    //         if (userResults.empty) {
    //             return false;
    //         }
    //         for (const doc of userResults.docs) {
    //             console.log(doc.data());
    //             console.log("Are the options defined?");
    //             console.log(options != undefined);
    //             if (options != undefined) {
    //                 if (doc.id == options?.exceptionId) continue;
    //             }
    //             if (doc.data()["email"] === email) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         }
    //         return false;
    //     } catch (error) {
    //         console.log("Email exists subfunction error");
    //         console.log(error.message);
    //         return false;
    //     }
    // }

    async savetoDB(user: User): Promise<boolean> {
        try {
            var result = await user.commit();
            return result.success;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async idExists(id: string): Promise<boolean> {
        var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
            await this.DB.collection('users').get();
        var x = 0;

        dbData.forEach((doc) => {
            if (id === doc.id) {
                x = 1;
            }
        });
        if (x == 1) {
            return true;
        } else return false;
    }

    countFunction(body: any, count: number) {
        count = 0;
        for (const key of Object.keys(body)) {
            if (key.includes(`${key}`)) {
                count++;
            }
        }
        return count;
    }
}
