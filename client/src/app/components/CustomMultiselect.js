import React, { useState, useCallback } from 'react';
import Multiselect from 'multiselect-react-dropdown';

const CustomMultiselect = ({ tagsOptions, selectedTags, setSelectedTags, setAllTags, allTags }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Enter' && inputValue && !tagsOptions.some(option => option.name.toLowerCase() === inputValue.toLowerCase())) {
            const newTag = { name: inputValue, id: new Date().getTime() }; // Generating a temporary unique ID
            setAllTags(prevTags => [...prevTags, newTag]);
            setSelectedTags(prevSelected => [...prevSelected, newTag]);
            setInputValue('');
        }
    }, [inputValue, tagsOptions, setAllTags, setSelectedTags]);

    const handleSearch = (text) => {
        setInputValue(text);
    };

    return (
        <div onKeyDown={handleKeyDown}>
            <Multiselect
                options={tagsOptions}
                selectedValues={selectedTags}
                displayValue="name"
                onSelect={(selectedList, selectedItem) => setSelectedTags(selectedList)}
                onRemove={(selectedList, removedItem) => setSelectedTags(selectedList)}
                onSearch={handleSearch}
                style={{
                    chips: { background: '#3f51b5' },
                    multiselectContainer: { color: '#3f51b5' }
                }}
                placeholder="Sélectionner ou ajouter un tag"
                hidePlaceholder={false}
                allowFreeText={true}
            />
        </div>
    );
};

export default CustomMultiselect;
