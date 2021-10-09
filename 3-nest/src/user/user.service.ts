import * as admin from 'firebase-admin';

import { debug, log } from 'console';

import { CRUDReturn } from './user.resource/crud_return.interface';
import { Helper } from './user.resource/helper';
import { Injectable } from '@nestjs/common';
import { User } from './user.resource/user.model';
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
            });
            return {
                success: true,
                data: results,
            };
        } catch (e) {
            return {
                success: false,
                data: e,
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
                            data['id'],
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
                var exists = this.emailExists(user.email);
                if (!this.emailExists(user.email)) {
                    var newUser: User = new User(
                        user.name,
                        user.age,
                        user.email,
                        user.password,
                    );
                    if (await this.savetoDB(newUser)) {
                        if (debug) this.logAllUser();
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
                    success: false,
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

    searchUser(term: string): CRUDReturn {
        var storeData = [];
        for (const bodyTerm of this.users.values()) {
            if (bodyTerm.matches(term)) {
                console.log('yawa');
                storeData.push(bodyTerm.toJson());
            }
        }
        if (storeData.length > 0) {
            return { success: true, data: storeData };
        } else {
            return {
                success: false,
                data: `${term} does not match any users in database!`,
            };
        }
    }

    replaceAllPut(user: any, id: string): CRUDReturn {
        try {
            var validBodyPut: { valid: boolean; data: string } =
                Helper.validBodyPut(user);

            if (validBodyPut.valid) {
                for (const newUser of this.users.values()) {
                    if (this.idExists(id)) {
                        var exists = this.emailExists(user.email);
                        if (!this.emailExists(user.email)) {
                            if (newUser.replaceValues(user)) {
                                return {
                                    success: true,
                                    data: newUser.toJson(),
                                };
                            }
                            return {
                                success: false,
                                data: `${user.emai} exists in current user.`,
                            };
                        }
                    } else
                        return {
                            success: false,
                            data: 'Does not replace the generated ID',
                        };
                }
                throw new Error(`${user.email} is already in use by another user!`);
            }
            throw new Error(validBodyPut.data);
        } catch (error) {
            return { success: false, data: `${error.message}` };
        }
    }

    replaceValuesPatch(user: any, id: string) {
        var validBody: { valid: boolean; data: string } = Helper.validBody(user);
        var count: number = this.countFunction(user, count);
        var firstUser: User = this.users.get(id);
        var secondUser: User;

        try {
            if (validBody.valid) {
                for (const newUser of this.users.values()) {
                    console.log('Success');
                    if (id == newUser.toJson().id) {
                        if (!this.emailExists(user?.email)) {
                            switch (count) {
                                case 1:
                                    if (user.name != undefined) {
                                        secondUser = new User(
                                            user.name,
                                            firstUser.toJson().age,
                                            firstUser.toJson().email,
                                            firstUser.anadertoJson().password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    if (user.age != undefined) {
                                        secondUser = new User(
                                            firstUser.toJson().name,
                                            user.age,
                                            firstUser.toJson().email,
                                            firstUser.anadertoJson().password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    if (user.email != undefined) {
                                        secondUser = new User(
                                            firstUser.toJson().name,
                                            firstUser.toJson().age,
                                            user.email,
                                            firstUser.anadertoJson().password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    if (user.password != undefined) {
                                        secondUser = new User(
                                            firstUser.toJson().name,
                                            firstUser.toJson().age,
                                            user.email,
                                            user.password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    return {
                                        success: true,
                                        data: firstUser.toJson(),
                                    };
                                    break;

                                case 2:
                                    if (user.name != undefined && user.age != undefined) {
                                        secondUser = new User(
                                            user.name,
                                            user.age,
                                            firstUser.toJson().email,
                                            firstUser.anadertoJson().password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    if (user.name != undefined && user.email != undefined) {
                                        secondUser = new User(
                                            firstUser.toJson().name,
                                            firstUser.toJson().age,
                                            user.email,
                                            firstUser.anadertoJson().password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    if (user.name != undefined && user.password != undefined) {
                                        secondUser = new User(
                                            firstUser.toJson().name,
                                            firstUser.toJson().age,
                                            firstUser.toJson().email,
                                            user.password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    if (user.age != undefined && user.email != undefined) {
                                        secondUser = new User(
                                            firstUser.toJson().name,
                                            user.age,
                                            user.email,
                                            firstUser.anadertoJson().password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    if (user.age != undefined && user.password != undefined) {
                                        secondUser = new User(
                                            firstUser.toJson().name,
                                            user.age,
                                            firstUser.toJson().email,
                                            user.password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    if (user.email != undefined && user.password != undefined) {
                                        secondUser = new User(
                                            firstUser.toJson().name,
                                            user.age,
                                            user.email,
                                            user.password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    return {
                                        success: true,
                                        data: firstUser.toJson(),
                                    };
                                    break;

                                case 3:
                                    if (
                                        user.name != undefined &&
                                        user.age != undefined &&
                                        user.email != undefined
                                    ) {
                                        secondUser = new User(
                                            user.name,
                                            user.age,
                                            user.email,
                                            firstUser.anadertoJson().password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    if (
                                        user.name != undefined &&
                                        user.age != undefined &&
                                        user.password != undefined
                                    ) {
                                        secondUser = new User(
                                            user.name,
                                            user.age,
                                            firstUser.toJson().email,
                                            user.password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    if (
                                        user.name != undefined &&
                                        user.email != undefined &&
                                        user.password != undefined
                                    ) {
                                        secondUser = new User(
                                            user.name,
                                            firstUser.toJson().age,
                                            user.email,
                                            user.password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    if (
                                        user.age != undefined &&
                                        user.email != undefined &&
                                        user.password != undefined
                                    ) {
                                        secondUser = new User(
                                            firstUser.toJson().name,
                                            user.age,
                                            user.email,
                                            firstUser.anadertoJson().password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    return {
                                        success: true,
                                        data: firstUser.toJson(),
                                    };
                                    break;
                                case 4:
                                    if (
                                        user.name != undefined &&
                                        user.age != undefined &&
                                        user.email != undefined &&
                                        user.password != undefined
                                    ) {
                                        secondUser = new User(
                                            user.name,
                                            user.age,
                                            user.email,
                                            user.password,
                                        );
                                        this.users.set(id, secondUser);
                                        this.users.get(id).newID(id);
                                        firstUser = secondUser;
                                    }
                                    return {
                                        success: true,
                                        data: firstUser.toJson(),
                                    };
                                    break;
                            }
                        } else
                            throw new Error(
                                `${user.email} exists in database that is not of the current user.`,
                            );
                    }
                }
                throw new Error('User not found!');
            } else {
                throw new Error(validBody.data);
            }
        } catch (error) {
            return { success: false, data: `${error.message}` };
        }
    }

    deleteUser(id: string): CRUDReturn {
        if (this.users.has(id)) {
            this.users.delete(id);
            return {
                success: true,
                data: 'User data is successfully deleted.',
            };
        } else {
            return {
                success: false,
                data: 'User data does not exist in database.',
            };
        }
    }

    loginUser(login: any): CRUDReturn {
        try {
            for (const user of this.users.values()) {
                if (user.toJson().email == login.email)
                    return user.login(login?.password);
            }
            throw new Error('Email does not match.');
        } catch (error) {
            console.log({ success: false, data: error.message });
            return { success: false, data: error.message };
        }
    }

    async emailExists(email: string): Promise<boolean> {
        var userResults = await this.DB.collection('users')
            .where('email', '==', email)
            .get();
        if (userResults.size > 0) {
            for (const doc of userResults.docs) {
                if (doc.data()['email'] === email) return false;
                else {
                    return true;
                }
            }
        } else {
            return false;
        }
    }

    async savetoDB(user: User): Promise<boolean> {
        try {
            var result = await user.commit();
            return result.success;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    idExists(id: string): boolean {
        for (const user of this.users.values()) {
            if (id == user.toJson().id) {
                return true;
            }
        }
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
