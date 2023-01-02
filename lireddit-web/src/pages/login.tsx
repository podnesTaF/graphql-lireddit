import React from 'react';
import {Formik, Form} from 'formik';
import {Box, Button, Flex, Link as A} from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import {useLoginMutation} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {useRouter} from "next/router";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import Link from "next/link";
import {auto} from "@popperjs/core";


const Login = () => {
    const router = useRouter()
    const [, login] = useLoginMutation()
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{usernameOrEmail: '', password: ''}}
                onSubmit={async (values, {setErrors}) => {
                    const res = await login(values)
                    console.log(res)
                    if(res.data?.login.errors) {
                        setErrors(toErrorMap(res.data.login.errors))
                    } else if (res.data?.login.user) {
                       if(typeof router.query.next === 'string') {
                            router.push(router.query.next)
                       } else {
                           router.push('/')
                       }
                    }
                }
                }>
                {({isSubmitting}) => (
                    <Form>
                        <InputField name='usernameOrEmail' placeholder='username or email' label='Username or Email'/>
                        <Box mt={4}>
                            <InputField
                                name='password'
                                placeholder='password'
                                label='Password'
                                type='password'/>
                        </Box>
                        <Flex>
                            <Link style={{marginLeft: 'auto', marginTop: '5px'}} href='/forgot-password'>
                                <A>forgot password?</A>
                            </Link>
                        </Flex>
                        <Button isLoading={isSubmitting} colorScheme='teal' color='white' type='submit'>Login</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(Login);