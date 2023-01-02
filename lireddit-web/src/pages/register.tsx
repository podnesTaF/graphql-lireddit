import React from 'react';
import {Formik, Form} from 'formik';
import {Box, Button} from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import {useRegisterMutation} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {useRouter} from "next/router";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";


const Register = () => {
    const router = useRouter()
    const [, register] = useRegisterMutation()
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{email: '', username: '', password: ''}}
                onSubmit={async (values, {setErrors}) => {
                    const res = await register({options: values})
                    console.log(res)
                    if(res.data?.register.errors) {
                        setErrors(toErrorMap(res.data.register.errors))
                    } else if (res.data?.register.user) {
                        router.push('/')
                    }
                }
            }>
                {({isSubmitting}) => (
                    <Form>
                        <InputField name='username' placeholder='username' label='Username'/>
                        <Box mt={4}>
                            <InputField
                                name='email'
                                placeholder='email'
                                label='Email'
                                type='email'/>
                        </Box>
                        <Box mt={4}>
                            <InputField
                                name='password'
                                placeholder='password'
                                label='Password'
                                type='password'/>
                        </Box>
                        <Button mt={4} isLoading={isSubmitting} colorScheme='teal' color='white' type='submit'>Register</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(Register);
