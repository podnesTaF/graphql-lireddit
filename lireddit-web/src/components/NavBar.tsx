import React, {useEffect, useState} from 'react';
import {Box, Button, Flex, Heading, Link as A, Text} from "@chakra-ui/react";
import Link from 'next/link'
import {useLogoutMutation, useMeQuery} from "../generated/graphql";
import {isServer} from "../utils/isServer";
import {useRouter} from "next/router";
const NavBar = () => {
    const router = useRouter()
    const [isServer, setIsServer] = useState(true)
    const [{fetching: logoutFetching}, logout] = useLogoutMutation()
    const [{data, fetching}] = useMeQuery({
        pause: isServer
    })

    useEffect(() => {
        setIsServer(false)
    }, [])

    let body = null

    if(fetching) {
        body = null
    } else if(!data?.me) {
        body = (
            <>
                <Link href='/login'>
                    <A mr={2}>Login</A>
                </Link>
                <Link href='/register'>
                    <A>Register</A>
                </Link>
            </>
        )
    } else {
        body = (
            <Flex align={'center'}>
                <Link href={'/create-post'}>
                    <Button colorScheme={'teal'} mr={5}>Create post</Button>
                </Link>
                <Box mx={4}>
                    <Text fontSize='xl'>{data.me.username}</Text>
                </Box>
                <Button colorScheme={'teal'} isLoading={logoutFetching} onClick={async () => {
                    // @ts-ignore
                    await logout()
                    router.reload()
                }} variant='link'>logout</Button>
            </Flex>
        )
    }
    return (
        <Flex zIndex={2} position='sticky' top={0} bg='tomato' p={4} >
            <Flex mx={"auto"} flex={1} align={'center'} maxW={800}>
                <Link href={'/'}>
                    <A>
                        <Heading>LiReddit</Heading>
                    </A>
                </Link>
                <Box ml={'auto'}>
                    {body}
                </Box>
            </Flex>
        </Flex>
    );
};

export default NavBar;
