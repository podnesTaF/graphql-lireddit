import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import { useMeQuery, usePostsQuery} from "../generated/graphql";
import React, {useState} from "react";
import {Box, Button, Flex, Heading, Link as A, Stack, Text} from "@chakra-ui/react";
import Layout from "../components/Layout";
import Link from "next/link";
import UpdootSection from "../components/UpdootSection";
import EditDelete from "../components/EditDelete";

const Index = () => {
    const [variables, setVariables] = useState({limit: 5, cursor: null as null | string})
    const [{data, error, fetching}] = usePostsQuery({
        variables
    })

    if(!fetching && !data) {
        return (
            <div>
                <div>you got query failed for some reason</div>
                <div>{error?.message}</div>
            </div>
        )
    }

    return (
    <Layout>
        {fetching && !data ? <div>loading...</div> :
            (
                <Stack spacing={8}>
                    {data!.posts.posts.map(p =>
                        !p ? null : (
                        <Flex key={p.id} py={5} px={3} shadow='md' borderWidth='1px' align={'center'} >
                           <UpdootSection post={p} />
                           <Box>
                               <Link href={`/post/${p.id}`}>
                                   <A><Heading fontSize='xl'>{p.title}</Heading></A>
                               </Link>
                               <Text>posted by {p.creator.username}</Text>
                               <Text mt={4}>{p.textSnippet}</Text>
                           </Box>
                            <EditDelete id={p.id} userId={p.creator.id} />
                        </Flex>
                    ))}
                </Stack>
            )
        }
        {data && data.posts.hasMore && (
            <Flex>
                <Button onClick={() => {
                    setVariables({
                        limit: variables.limit,
                        cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
                    })
                }} isLoading={fetching} mx='auto' my={8}>Load more</Button>
            </Flex>
        )}
    </Layout>
)}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
