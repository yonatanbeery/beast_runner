import { ReactNode } from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import './filters.css'

interface FilterProps {
    placeHolder: string;
    children: ReactNode;
}

const Filter = (props: FilterProps) => {
    const { placeHolder, children } = props;

    return (
        <FormControl className="filter">
            <InputLabel>{placeHolder}</InputLabel>
            {children}
        </FormControl>
    );
};

export default Filter;