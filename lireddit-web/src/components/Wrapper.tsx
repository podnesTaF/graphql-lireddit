import React from 'react';
import {Box} from "@chakra-ui/react";

export type  WrapperVariant = 'small' | 'regular'
interface WrapperProps {
    children: React.ReactNode;
    variant?: WrapperVariant;

}
const Wrapper: React.FC<WrapperProps> = ({children, variant}) => {
    return (
        <Box mt={8} mx='auto' maxW={variant === "small" ? "400px" : "800px"} w='100%'>
            {children}
        </Box>
    );
};

export default Wrapper;
