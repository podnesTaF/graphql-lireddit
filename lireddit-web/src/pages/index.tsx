import NavBar from "../components/NavBar";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import {usePostsQuery} from "../generated/graphql";
import React from "react";
import {Box, Link as A} from "@chakra-ui/react";
import Layout from "../components/Layout";
import Link from "next/link";

const Index = () => {
    const [{data}] = usePostsQuery()
    return (
    <Layout>
        <h1>My page</h1>
        {!data ? <div>loading...</div> : data.posts.map(p => (
            <Box key={p.id}>
                <h1>{p.title}</h1>
            </Box>
        ))}
    </Layout>
)}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
