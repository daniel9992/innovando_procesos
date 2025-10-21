import { Accordion } from '@chakra-ui/react';
import { useState, type FC, type ReactNode } from 'react';
import { MyFlex } from './myFlex';

interface MyAccordionInput {
    id: string;
    header: ReactNode;
    accordion: ReactNode;
    isDisabled?: boolean;
}

interface MyAccordionProps {
    value?: string[];
    onValueChange?: (value: string[]) => void;
    variant?: 'outline' | 'subtle' | 'enclosed' | 'plain';
    items?: MyAccordionInput[];
    isMultiple?: boolean;
    isDisabled?: boolean;
}

export const MyAccordion: FC<MyAccordionProps> = ({
    value = [],
    onValueChange = () => {},
    items = [],
    variant = 'subtle',
    isMultiple = false
}) => {
    const [valueLocal, setValueLocal] = useState<string[]>(value);

    const handleOnValueChange = (value: string[]) => {
        setValueLocal(value);
        onValueChange(value);
    };

    return (
        <Accordion.Root
            collapsible
            variant={variant}
            value={valueLocal}
            defaultValue={valueLocal}
            onValueChange={(e) => handleOnValueChange(e.value)}
            multiple={isMultiple}
        >
            {items.map((item, index) => (
                <Accordion.Item
                    key={index}
                    value={item.id}
                    disabled={item.isDisabled}
                >
                    <Accordion.ItemTrigger>
                        <MyFlex
                            flex={1}
                            cursor={item.isDisabled ? 'not-allowed' : 'pointer'}
                        >
                            {item.header}
                        </MyFlex>
                        <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                        <Accordion.ItemBody>
                            {item.accordion}
                        </Accordion.ItemBody>
                    </Accordion.ItemContent>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
};
