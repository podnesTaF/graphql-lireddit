import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import {usePostsQuery} from "../generated/graphql";
import React, {useState} from "react";
import {Box, Button, Flex, Heading, IconButton, Link as A, Stack, Text} from "@chakra-ui/react";
import Layout from "../components/Layout";
import Link from "next/link";
import {ChevronDownIcon, ChevronUpIcon, Icon} from "@chakra-ui/icons";
import UpdootSection from "../components/UpdootSection";

const Index = () => {
    const [variables, setVariables] = useState({limit: 5, cursor: null as null | string})
    const [{data, fetching}] = usePostsQuery({
        variables
    })

    if(!fetching && !data) {
        return (
            <div>
                <div>you got query failed for some reason</div>
            </div>
        )
    }

    return (
    <Layout>
        <Flex align='center' justifyContent={'space-between'}>
            <Heading>LiReddit</Heading>
            <Link href='create-post'>
                <A ml={'auto'}>create post</A>
            </Link>
        </Flex>
        <br/>
        {fetching && !data ? <div>loading...</div> :
            (
                <Stack spacing={8}>
                    {data!.posts.posts.map(p => (
                        <Flex key={p.id} py={5} px={3} shadow='md' borderWidth='1px' >
                           <UpdootSection post={p} />
                           <Box>
                               <Heading fontSize='xl'>{p.title}</Heading>
                               <Text>posted by {p.creator.username}</Text>
                               <Text mt={4}>{p.textSnippet}</Text>
                           </Box>
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
