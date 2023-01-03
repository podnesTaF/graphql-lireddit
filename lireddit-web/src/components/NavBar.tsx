import React from 'react';
import {Box, Button, Flex, Link as A} from "@chakra-ui/react";
import Link from 'next/link'
import {useLogoutMutation, useMeQuery} from "../generated/graphql";
import {isServer} from "../utils/isServer";
const NavBar = () => {
    const [{fetching: logoutFetching}, logout] = useLogoutMutation()
    const [{data, fetching}] = useMeQuery({
        pause: isServer()
    })


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
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button isLoading={logoutFetching} onClick={() => {
                    logout()
                }} variant='link'>logout</Button>
            </Flex>
        )
    }
    return (
        <Flex zIndex={2} position='sticky' top={0} bg='tomato' p={4}>
            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    );
};

export default NavBar;
