import React, {useState} from 'react';
import {NextPage} from "next";
import Wrapper from "../../components/Wrapper";
import {Form, Formik} from "formik";
import {toErrorMap} from "../../utils/toErrorMap";
import InputField from "../../components/InputField";
import {Box, Button, Flex, Link as A} from "@chakra-ui/react"
import {useChangePasswordMutation} from "../../generated/graphql";
import {useRouter} from "next/router";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../../utils/createUrqlClient";
import Link from "next/link";
const ChangePassword: NextPage = () => {
    const [, changePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState('')
    const router = useRouter()

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{newPassword: ''}}
                onSubmit={async (values, {setErrors}) => {
                    const res = await changePassword({
                        newPassword: values.newPassword,
                        token: router.query.token as string
                    })

                    if(res.data?.changePassword.errors) {
                        const errorMap = toErrorMap(res.data.changePassword.errors)
                        if('token' in errorMap) {
                            setTokenError(errorMap.token)
                        }
                        setErrors(errorMap)
                    } else {
                        router.push('/')
                    }
                }
                }>
                {({isSubmitting}) => (
                    <Form>
                        <Box mt={4}>
                            <InputField
                                name='newPassword'
                                placeholder='new password'
                                label='New Password'
                                type='password'/>
                        </Box>
                        {tokenError ? (
                            <Flex mt={4} color='red'>
                                <Box mr={2}>
                                    {tokenError}
                                </Box>
                                <Link style={{color: 'white'}} href='/forgot-password'>
                                    <A>click here to get a new one</A>
                                </Link>
                            </Flex>
                        ) : null}
                        <Button mt={4} isLoading={isSubmitting} colorScheme='teal' color='white' type='submit'>Change Password</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
