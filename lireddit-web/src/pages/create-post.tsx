import React, {useEffect} from 'react';
import Wrapper from "../components/Wrapper";
import {Form, Formik} from "formik";
import InputField from "../components/InputField";
import {Box, Button, Flex} from "@chakra-ui/react";
import {useCreatePostMutation, useMeQuery} from "../generated/graphql";
import {useRouter} from "next/router";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import Layout from "../components/Layout";
import {useIsAuth} from "../utils/useIsAuth";

const CreatePost = () => {
    useIsAuth()
    const [, createPost] = useCreatePostMutation()
    const router = useRouter()

    return (
        <Layout variant='small'>
            <Formik
                initialValues={{title: '', text: ''}}
                onSubmit={async (values, {setErrors}) => {
                    const {error} = await createPost({input: values})
                    if(!error) {
                        router.push('/')
                    }

                }
                }>
                {({isSubmitting}) => (
                    <Form>
                        <InputField name='title' placeholder='title' label='Title'/>
                        <Box mt={4}>
                            <InputField
                                textarea={true}
                                name='text'
                                placeholder='text...'
                                label='Content'/>
                        </Box>
                        <Button mt={4} isLoading={isSubmitting} colorScheme='teal' color='white' type='submit'>Create Post</Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
