import React from 'react';
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../../../utils/createUrqlClient";
import {Form, Formik} from "formik";
import InputField from "../../../components/InputField";
import {Box, Button, Heading} from "@chakra-ui/react";
import Layout from "../../../components/Layout";
import {usePostQuery, useUpdatePostMutation} from "../../../generated/graphql";
import {useRouter} from "next/router";
import {useGetIntId} from "../../../utils/useGetIntId";

const EditPost = () => {
    const router = useRouter()
    const id = useGetIntId()
    const [{data, fetching}] = usePostQuery({
        pause: id === -1,
        variables: {
            id
        }
    })
    const [, updatePost] = useUpdatePostMutation()

    if(fetching) {
        return <Layout>
            <Heading textAlign={"center"} mb={4}>loading...</Heading>
        </Layout>
    }

    if(!data?.post) {
        return <Layout>
            <Box>could not find post</Box>
        </Layout>
    }



    return (
        <Layout variant='small'>
            <Formik
                initialValues={{title: data.post.title, text: data.post.text}}
                onSubmit={async (values, {setErrors}) => {
                    if(data?.post) {
                        const {error} = await updatePost({id, ...values})
                        if(!error) {
                            router.back()
                        }
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
                        <Button mt={4} isLoading={isSubmitting} colorScheme='teal' color='white' type='submit'>Update Post</Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient)(EditPost);
