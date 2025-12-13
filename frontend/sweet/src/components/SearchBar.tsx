import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (params: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchParams, setSearchParams] = useState({
        name: '',
        category: '',
        minPrice: '',
        maxPrice: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearch = () => {
        const params: any = {};

        if (searchParams.name) params.name = searchParams.name;
        if (searchParams.category) params.category = searchParams.category;
        if (searchParams.minPrice) params.minPrice = parseFloat(searchParams.minPrice);
        if (searchParams.maxPrice) params.maxPrice = parseFloat(searchParams.maxPrice);

        onSearch(params);
    };

    const handleReset = () => {
        setSearchParams({
            name: '',
            category: '',
            minPrice: '',
            maxPrice: '',
        });
        onSearch({});
    };

    return (
        <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
                🔍 Search & Filter
            </h3>

            <div className="search-bar">
                <input
                    type="text"
                    name="name"
                    className="form-control search-input"
                    placeholder="Search by name..."
                    value={searchParams.name}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="category"
                    className="form-control search-input"
                    placeholder="Category..."
                    value={searchParams.category}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="minPrice"
                    className="form-control"
                    placeholder="Min Price"
                    value={searchParams.minPrice}
                    onChange={handleChange}
                    style={{ width: '120px' }}
                />

                <input
                    type="number"
                    name="maxPrice"
                    className="form-control"
                    placeholder="Max Price"
                    value={searchParams.maxPrice}
                    onChange={handleChange}
                    style={{ width: '120px' }}
                />

                <button className="btn btn-primary" onClick={handleSearch}>
                    Search
                </button>

                <button className="btn btn-outline" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
