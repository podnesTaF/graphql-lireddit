/** @format */

import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from 'type-graphql';
import {MyContext} from '../types';
import {User} from '../entities/User';
import argon2 from 'argon2';
import {COOKIE_NAME, FORGET_PASSWORD_PREFIX} from '../constants';
import {UsernamePasswordInput} from './UsernamePasswordInput';
import {validateRegister} from '../utils/validateRegister';
import {sendEmail} from '../utils/sendEmail';
import {v4 as uuidv4} from 'uuid';
import {getConnection} from "typeorm";

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => User, {nullable: true})
    user?: User;

    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() {redis, req}: MyContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 5) {
            return {
                errors: [
                    {
                        field: 'newPassword',
                        message: 'length must be greater than 5',
                    },
                ],
            };
        }

        const key = FORGET_PASSWORD_PREFIX + token;
        const userId = await redis.get(key);
        if (!userId) {
            return {
                errors: [
                    {
                        field: 'token',
                        message: 'token expired',
                    },
                ],
            };
        }

        const user = await User.findOneBy({id: parseInt(userId)});

        if (!user) {
            return {
                errors: [
                    {
                        field: 'token',
                        message: 'user no longer exists',
                    },
                ],
            };
        }

        await User.update(
            {
                id: parseInt(userId)
            },
            {
                password: await argon2.hash(newPassword)
            });

        await redis.del(key);

        req.session.userId = user.id;

        return {
            user
        };
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() {redis}: MyContext
    ) {
        const user = await User.findOneBy({email});

        if (!user) {
            return true;
        }

        const token = uuidv4();

        await redis.set(
            FORGET_PASSWORD_PREFIX + token,
            user.id,
            'PX',
            1000 * 60 * 60 * 24
        );

        await sendEmail(
            email,
            `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
        );

        return true;
    }

    @Query(() => User, {nullable: true})
    me(@Ctx() {req}: MyContext) {
        return
        if (!req.session.userId) {
            return null;
        }
        return User.findOneBy({id: req.session.userId});
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {req}: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) {
            return {errors};
        }

        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            const result = await getConnection().createQueryBuilder().insert().into(User).values({
                username: options.username,
                email: options.email,
                password: hashedPassword
            }).returning('*').execute();

            user = result.raw[0];
        } catch (e) {
            console.log('message: ', e.message);
            if (e.detail.includes('already exists')) {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'username already taken',
                        },
                    ],
                };
            }
        }

        req.session.userId = user.id;

        return {
            user,
        };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() {req}: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOneBy(
                usernameOrEmail.includes('@')
                    ? {email: usernameOrEmail}
                    : {username: usernameOrEmail}
            );

        if (!user) {
            return {
                errors: [
                    {
                        field: 'usernameOrEmail',
                        message: 'that username or email does not exist',
                    },
                ],
            };
        }

        const isValid = await argon2.verify(user.password, password);

        if (!isValid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'incorrect password',
                    },
                ],
            };
        }

        req.session.userId = user.id;

        return {
            user,
        };
    }

    @Mutation(() => Boolean)
    logout(@Ctx() {res, req}: MyContext) {
        return new Promise((resolve) =>
            req.session.destroy((err: any) => {
                res.clearCookie(COOKIE_NAME);
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }

                resolve(true);
            })
        );
    }
}
