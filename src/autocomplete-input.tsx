import {
  forwardRef,
  Input,
  InputProps,
  InputGroup, 
  InputRightElement, 
  Spinner,
  SystemStyleObject,
  useMergeRefs,
  useMultiStyleConfig,
  Wrap,
  WrapItem, 
  PopoverAnchor
} from "@chakra-ui/react";
import { runIfFn } from "@chakra-ui/utils";
import { MaybeRenderProp } from "@chakra-ui/react-utils";
import React from "react";

import { useAutoCompleteContext } from "./autocomplete-context";
import { UseAutoCompleteReturn } from "./types";

export interface AutoCompleteInputProps extends Omit<InputProps, "children"> {
  children?: MaybeRenderProp<{ tags: UseAutoCompleteReturn["tags"] }>;
  wrapStyles?: SystemStyleObject;
  hidePlaceholder?: boolean;
  loadingIcon?: React.ReactNode
}

const AutoCompleteInputComponent = forwardRef(
  (props, forwardedRef) => {
    const { isLoading } = useAutoCompleteContext();

    return <InputGroup>
    <Input {...props} ref={forwardedRef} />
    { isLoading && <InputRightElement>
      { props.loadingIcon || <Spinner /> }
    </InputRightElement> }
  </InputGroup>;
  }
)

export const AutoCompleteInput = forwardRef<AutoCompleteInputProps, "input">(
  (props, forwardedRef) => {
    const {
      autoCompleteProps,
      inputRef,
      getInputProps,
      tags,
    } = useAutoCompleteContext();

    // const ref = useMergeRefs(forwardedRef, inputRef);

    const {
      children: childrenProp,
      isInvalid,
      hidePlaceholder,
      ...rest
    } = props;

    const themeInput: any = useMultiStyleConfig("Input", props);

    let { wrapper, input: inputProps } = getInputProps(rest, themeInput);
    const { ref: wrapperRef, ...wrapperProps } = wrapper;
    const ref = useMergeRefs(forwardedRef, inputRef);

    const children = runIfFn(childrenProp, { tags });
    if (hidePlaceholder) {
      inputProps = {
        ...inputProps,
        placeholder:
          Array.isArray(children) && children.length
            ? undefined
            : inputProps.placeholder,
      };
    }

    const simpleInput = (
      <AutoCompleteInputComponent isInvalid={isInvalid} {...(inputProps as any)} ref={ref} />
    );

    const multipleInput = (
      <Wrap {...wrapperProps} ref={wrapperRef}>
        {children}
        <WrapItem as={AutoCompleteInputComponent} {...(inputProps as any)} ref={ref} />
      </Wrap>
    );

    return <PopoverAnchor>{autoCompleteProps.multiple ? multipleInput : simpleInput}</PopoverAnchor>;
  }
);

AutoCompleteInput.displayName = "Input";

AutoCompleteInput.id = "Input";
