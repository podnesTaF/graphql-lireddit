import React from 'react';
import {Box, IconButton, Text} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {PostSnippetFragment, useVoteMutation} from "../generated/graphql";


interface UpdootSectionProps {
    post: PostSnippetFragment;
}
const UpdootSection: React.FC<UpdootSectionProps> = ({post}) => {
    const [loadingState, setLoadingState] = React.useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading');
    const [, vote] = useVoteMutation()

    return (
        <Box mr={3}>
            <Box>
                <IconButton
                    onClick={async () => {
                    setLoadingState('updoot-loading')
                    await vote({value: 1, postId: post.id})
                    setLoadingState('not-loading')
                }}
                    isLoading={loadingState === 'updoot-loading'}
                    aria-label='Search database'
                    icon={<ChevronUpIcon boxSize='2em' />} />
            </Box>
            <Box>
                <Text textAlign='center'>{post.points}</Text>
            </Box>
            <Box>
                <IconButton
                    onClick={async () => {
                    setLoadingState('downdoot-loading')
                    await vote({value: -1, postId: post.id})
                    setLoadingState('not-loading')
                    }}
                    isLoading={loadingState === 'downdoot-loading'}
                    aria-label='Search database'
                    icon={<ChevronDownIcon boxSize='2em' />} />
            </Box>
        </Box>
    );
};

export default UpdootSection;
