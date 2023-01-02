import React from 'react';
import {Form, Formik} from "formik";
import InputField from "../components/InputField";
import {Box, Button} from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import {createUrqlClient} from "../utils/createUrqlClient";
import {withUrqlClient} from "next-urql";
import {useForgotPasswordMutation} from "../generated/graphql";

const ForgotPassword = () => {

    const [complete, setComplete] = React.useState(false)
    const [, forgotPassword] = useForgotPasswordMutation()

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{email: ''}}
                onSubmit={async (values) => {
                    await forgotPassword(values)
                    setComplete(true)
                }
                }>
                {({isSubmitting}) => complete ? (
                        <Box>If an account with that email exist, we sent you an email</Box>
                    ) :
                    (
                        <Form>
                            <Box my={4}>
                                <InputField name='email' placeholder='email' label='Email'/>
                            </Box>
                            <Button isLoading={isSubmitting} colorScheme='teal' color='white' type='submit'>forgot
                                password</Button>
                        </Form>
                    )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
