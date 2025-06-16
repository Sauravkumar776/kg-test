import PropertyGrid from '../../components/PropertyGrid/PropertyGrid';
import PropertyFilters from '../../components/PropertyFilters/PropertyFilters';
import './Home.scss';

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-filters">
        <PropertyFilters />
      </div>
      <div className="home-content">
        <PropertyGrid />
      </div>
    </div>
  );
};

export default Home;
