import Select, { SelectChangeEvent } from '@mui/material/Select';
import Filter from './FIlter';
import MenuItem from '@mui/material/MenuItem';
import { useContext } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import './filters.css';
import { FiltersOptions, Price, RoomsOption, homeTypeOptions, roomsOptions } from './filtersTypes';
import Button from '@mui/material/Button';
import { CitiesContext } from '../../App';

interface FiltersProps {
    filters: FiltersOptions;
    setFilters: (filters: FiltersOptions) => void;
    getPosts: (filters: FiltersOptions) => void;
}

const Filters = (filtersProp: FiltersProps ) => {
    const {filters, setFilters, getPosts} = filtersProp;

    const {cities} = useContext(CitiesContext);

    const updateLocation = ((location: string) => setFilters({...filters, location}));
    const updateDealType = (newDealType: FiltersOptions['dealType']) => setFilters({...filters, dealType: newDealType});
    const updatPrice = (newPrice: Price) => setFilters({...filters, price: newPrice});
    const updateMinBedrooms = (updatedBedrooms: number) => setFilters({...filters, bedrooms: updatedBedrooms as RoomsOption});
    const updateMinBathrooms = (updatedBathrooms: number) => setFilters({...filters, bathrooms: updatedBathrooms as RoomsOption});
    const updateHomeType = (newHomeType: FiltersOptions['homeType']) => setFilters({...filters, homeType: newHomeType});

    return (
        <div className='filters'>
            <Filter placeHolder=''>
                <Autocomplete
                disablePortal
                options={cities}
                renderInput={(params) => <TextField {...params} label="City" />}
                onChange={(event: any) => updateLocation(event.target.innerText || null)}
                popupIcon={<SearchIcon />}
                />
            </Filter>
            <Filter placeHolder='Deal Type'>
                <Select onChange={(event: SelectChangeEvent) => updateDealType(event.target.value as FiltersOptions['dealType'])}>
                    <MenuItem value={'sale'}>For Sale</MenuItem>
                    <MenuItem value={'rent'}>For Rent</MenuItem>
                </Select>
            </Filter>
            <Filter placeHolder=''>
                <TextField 
                    type="number"
                    label="Min Price"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        updatPrice({
                            minPrice: parseInt(event.target.value) || null,
                            maxPrice: filters.price?.maxPrice});
                    }}
                />
            </Filter>
            <Filter placeHolder=''>
                <TextField 
                    type="number"
                    label="Max Price"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        updatPrice({
                            minPrice: filters.price?.minPrice,
                            maxPrice: parseInt(event.target.value) || null});  
                    }}
                />
            </Filter>
            <Filter placeHolder='Bedrooms'>
                <Select onChange={(event: SelectChangeEvent) => updateMinBedrooms(parseInt(event.target.value))}>
                    {roomsOptions.map(option => <MenuItem value={option}>{option}+</MenuItem>)}
                </Select>
            </Filter>
            <Filter placeHolder='Bathrooms'>
                <Select onChange={(event: SelectChangeEvent) => updateMinBathrooms(parseInt(event.target.value))}>
                    {roomsOptions.map(option => <MenuItem value={option}>{option}+</MenuItem>)}
                </Select>
            </Filter>
            <Filter placeHolder='Home Type'>
                <Select onChange={(event: SelectChangeEvent) => updateHomeType(event.target.value as FiltersOptions['homeType'])}>
                    {homeTypeOptions.map(option => <MenuItem value={option}>{option}</MenuItem>)}
                </Select>
            </Filter>
            <Button variant="contained" onClick={() => getPosts(filters)} className='filter'>Search</Button>
        </div>
    );
};

export default Filters;