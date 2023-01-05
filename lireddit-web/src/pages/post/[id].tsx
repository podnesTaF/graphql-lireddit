import React from 'react';
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../../utils/createUrqlClient";
import Layout from "../../components/Layout";
import {Box, Flex, Heading, Text} from '@chakra-ui/react';
import {useGetPostFromUrl} from "../../utils/useGetPostFromUrl";
import EditDelete from "../../components/EditDelete";

const PostPage = () => {
    const [{data, fetching}] = useGetPostFromUrl()

    if (fetching) {
        return (
            <Layout>
                <div>loading...</div>
            </Layout>
        )
    }

    if(!data?.post) {
        return <Layout>
            <Box>could not find post</Box>
        </Layout>
    }

    return (
        <Layout>
            <Flex width={'100%'}>
                <Box>
                    <Heading mb={4}>{data.post.title}</Heading>
                    <Text>{data.post.text}</Text>
                </Box>
                <Box ml={'auto'}>
                    <EditDelete id={data.post.id} userId={data.post.creator.id} />
                </Box>
            </Flex>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(PostPage);
