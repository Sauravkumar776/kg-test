import React, { useState, useEffect } from 'react';
import PropertyGrid from '../../components/PropertyGrid/PropertyGrid';
import PropertyFilters from '../../components/PropertyFilters/PropertyFilters';
import { ApiUtil } from '../../lib/apiUtil';
import { filterProperties, DEFAULT_FILTERS } from '../../lib/filterUtil';
import './Home.scss';

const Home = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    ApiUtil.getProperties().then((data) => {
      setAllProperties(data);
      setFilteredProperties(data);
    });
  }, []);

  useEffect(() => {
    const filtered = filterProperties(allProperties, filters);
    setFilteredProperties(filtered);
  }, [allProperties, filters]);

  return (
    <div className="home-page">
      <div className="home-filters">
        <PropertyFilters filters={filters} onFiltersChange={setFilters} />
      </div>
      <div className="home-content">
        <PropertyGrid properties={filteredProperties} />
      </div>
    </div>
  );
};

export default Home;