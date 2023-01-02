import {Arg, Ctx, Field, InputType, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {Post} from "../entities/Post";
import {MyContext} from "../types";
import {isAuth} from "../middleware/isAuth";

@InputType()
class PostInput {
    @Field()
    title: string;
    @Field()
    text: string;
}


@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(): Promise<Post[]> {
        return Post.find()
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg('id') id: number,
    ): Promise<Post | null> {
        return Post.findOneBy({id})
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Ctx() {req}: MyContext,
        @Arg('input') input: PostInput,
    ): Promise<Post> {


        return Post.create({
            ...input,
            creatorId: req.session.userId
        }).save()
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, {nullable: true}) title: string,
    ): Promise<Post | null> {
        const post = await Post.findOneBy({id})
        if (!post) {
            return null
        }
        if (typeof title !== 'undefined') {
            await Post.update({id}, {title})
        }
        return post
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number,
    ): Promise<boolean> {
       await Post.delete(id)
        return true
    }

}