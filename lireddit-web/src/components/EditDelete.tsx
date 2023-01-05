import React from 'react';
import {Flex, IconButton, Link as A} from "@chakra-ui/react";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import Link from "next/link";
import {PostSnippetFragment, useDeletePostMutation, useMeQuery} from "../generated/graphql";

interface EditDeleteProps {
    id: number;
    userId: number;
}
const EditDelete: React.FC<EditDeleteProps> = ({id, userId}) => {
    const [, deletePost] = useDeletePostMutation()
    const [{data: meData}] = useMeQuery()

    if(meData?.me?.id !== userId) {
        return null
    }

    return (
        <Flex direction={'column'} ml={'auto'}>
            <A>
                <IconButton
                    onClick={() => {
                        deletePost({id})
                    }}
                    mb={4}
                    aria-label='Search database'
                    colorScheme='red'
                    icon={<DeleteIcon boxSize='2em' />}
                />
            </A>
            <Link href={`/post/edit/${id}`}>
                <IconButton aria-label={'Search database'} colorScheme='teal' icon={<EditIcon boxSize='2em' />} />
            </Link>
        </Flex>
    );
};

export default EditDelete;
