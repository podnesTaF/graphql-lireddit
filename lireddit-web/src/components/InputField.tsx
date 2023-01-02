import React, {InputHTMLAttributes} from 'react';
import {FormControl, FormErrorMessage, FormLabel, Textarea} from "@chakra-ui/react";
import {Input} from "@chakra-ui/input";
import {useField} from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
    textarea?: boolean;
}
const InputField: React.FC<InputFieldProps> = ({label, size: _, textarea, ...props}) => {
    const [field, {error}] = useField(props)

    let TextField: any = Input;
    if (textarea) {
        TextField = Textarea
    }

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <TextField {...field} {...props} id={field.name} />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};

export default InputField;
