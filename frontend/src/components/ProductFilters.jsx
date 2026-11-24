
/*
=========================================================
FASHION SHOP - PRODUCT FILTERS
File: frontend/src/components/ProductFilters.jsx

PURPOSE:
Allows customers to filter products using:
1. Brand
2. Price range
3. Size
4. Color
5. Fabric
6. Fit
7. Rating
8. Stock availability
9. New arrivals

Uses existing filterUtils.js
=========================================================
*/

import { useMemo, useState } from "react";
import { getFilterOptions } from "../utils/filterUtils";
import "./ProductFilters.css";

function ProductFilters({ products = [], onFilterChange }) {

  // Available filter options are generated from product data.
  const options = useMemo(
    () => getFilterOptions(products),
    [products]
  );

  // Selected filter values.
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedFits, setSelectedFits] = useState([]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [newArrivals, setNewArrivals] = useState(false);

  // Updates a selected option in a filter group.
  const toggleOption = (value, selected, setter) => {
    setter((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  };

  // Sends selected filters to the parent component.
  const applyFilters = () => {
    const filters = {
      brands: selectedBrands,
      sizes: selectedSizes,
      colors: selectedColors,
      fabrics: selectedFabrics,
      fits: selectedFits,
      minPrice: minPrice === "" ? null : Number(minPrice),
      maxPrice: maxPrice === "" ? null : Number(maxPrice),
      rating: rating === "" ? 0 : Number(rating),
      inStockOnly,
      newArrivals,
    };

    onFilterChange?.(filters);
  };

  // Clears all selected filters.
  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedFabrics([]);
    setSelectedFits([]);

    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setInStockOnly(false);
    setNewArrivals(false);

    onFilterChange?.({
      brands: [],
      sizes: [],
      colors: [],
      fabrics: [],
      fits: [],
      minPrice: null,
      maxPrice: null,
      rating: 0,
      inStockOnly: false,
      newArrivals: false,
    });
  };

  // Reusable checkbox group.
  const renderOptions = (title, values, selected, setter) => (
    <div className="filter-group" key={title}>
      <h4>{title}</h4>

      <div className="filter-options">
        {values.map((value) => (
          <label className="filter-option" key={value}>
            <input
              type="checkbox"
              checked={selected.includes(value)}
              onChange={() =>
                toggleOption(value, selected, setter)
              }
            />

            <span>{value}</span>
          </label>
        ))}

        {values.length === 0 && (
          <p className="filter-empty">No options available</p>
        )}
      </div>
    </div>
  );

  return (
    <aside className="product-filters">

      {/* Filter heading */}
      <div className="filters-header">
        <h3>Filters</h3>

        <button
          type="button"
          onClick={resetFilters}
          className="reset-filter-button"
        >
          Clear All
        </button>
      </div>

      {/* Brand filter */}
      {renderOptions(
        "Brand",
        options.brands,
        selectedBrands,
        setSelectedBrands
      )}

      {/* Price range */}
      <div className="filter-group">
        <h4>Price Range</h4>

        <div className="price-range-inputs">
          <input
            type="number"
            min="0"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />

          <input
            type="number"
            min="0"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </div>
      </div>

      {/* Size filter */}
      {renderOptions(
        "Size",
        options.sizes,
        selectedSizes,
        setSelectedSizes
      )}

      {/* Color filter */}
      {renderOptions(
        "Color",
        options.colors,
        selectedColors,
        setSelectedColors
      )}

      {/* Fabric filter */}
      {renderOptions(
        "Fabric",
        options.fabrics,
        selectedFabrics,
        setSelectedFabrics
      )}

      {/* Fit filter */}
      {renderOptions(
        "Fit",
        options.fits,
        selectedFits,
        setSelectedFits
      )}

      {/* Rating filter */}
      <div className="filter-group">
        <h4>Customer Rating</h4>

        <select
          className="filter-select"
          value={rating}
          onChange={(event) => setRating(event.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="4">4★ & Above</option>
          <option value="3">3★ & Above</option>
          <option value="2">2★ & Above</option>
        </select>
      </div>

      {/* Availability filters */}
      <div className="filter-group">
        <h4>Availability</h4>

        <label className="filter-option">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) =>
              setInStockOnly(event.target.checked)
            }
          />

          <span>In Stock Only</span>
        </label>

        <label className="filter-option">
          <input
            type="checkbox"
            checked={newArrivals}
            onChange={(event) =>
              setNewArrivals(event.target.checked)
            }
          />

          <span>New Arrivals</span>
        </label>
      </div>

      {/* Apply filters */}
      <button
        type="button"
        className="apply-filters-button"
        onClick={applyFilters}
      >
        Apply Filters
      </button>

    </aside>
  );
}

export default ProductFilters;
