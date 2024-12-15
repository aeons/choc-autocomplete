import {
  Box,
  BoxProps,
  Separator,
  SeparatorProps,
  Flex,
  FlexProps,
} from "@chakra-ui/react";
import { omit } from "./utils";
import { forwardRef } from "react";
import { useAutoCompleteContext } from "./autocomplete-context";

export interface AutoCompleteGroupProps extends BoxProps {
  children?: React.ReactNode;
  showDivider?: boolean;
  dividerColor?: string;
}

export const AutoCompleteGroup = forwardRef<HTMLDivElement, AutoCompleteGroupProps>(
  (props, ref) => {
    const { children, showDivider, ...restProps } = props;
    const rest = omit(restProps, ["groupSibling"] as any);

    const { getGroupProps } = useAutoCompleteContext();

    const { group } = getGroupProps(props);

    const dividerStyles = useDividerStyles(props);

    return (
      <Box ref={ref} {...group} {...rest}>
        <Separator {...dividerStyles.top} />
        {children}
        <Separator {...dividerStyles.bottom} />
      </Box>
    );
  }
);

export const AutoCompleteGroupTitle = forwardRef<HTMLDivElement, FlexProps>(
  (props, ref) => {
    return <Flex {...baseTitleStyles} {...props} ref={ref} />;
  }
);

AutoCompleteGroup.displayName = "AutoCompleteGroup";
AutoCompleteGroupTitle.displayName = "AutoCompleteGroupTitle";

const baseTitleStyles: FlexProps = {
  ml: 5,
  my: 1,
  fontSize: "xs",
  letterSpacing: "wider",
  fontWeight: "extrabold",
  textTransform: "uppercase",
};

const useDividerStyles = (
  props: AutoCompleteGroupProps & { groupSibling?: boolean }
) => {
  const { getGroupProps } = useAutoCompleteContext();

  const hasGroupSibling: unknown = props.groupSibling;

  const {
    divider: { hasFirstChild, hasLastChild },
  } = getGroupProps(props as AutoCompleteGroupProps);

  const baseStyles: SeparatorProps = {
    my: 2,
    borderColor: props.dividerColor,
  };

  const top = {
    ...baseStyles,
    mb: 4,
    display: !props.showDivider || hasFirstChild ? "none" : "",
  };
  const bottom = {
    ...baseStyles,
    display:
      !props.showDivider || hasLastChild || hasGroupSibling ? "none" : "",
  };

  return { top, bottom };
};
