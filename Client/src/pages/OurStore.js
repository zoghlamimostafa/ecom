import React, { useEffect, useState, useCallback } from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import ReactStars from "react-rating-stars-component";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { CgGames } from "react-icons/cg";
import { SiMakerbot } from "react-icons/si";
import { FaCodeCompare } from "react-icons/fa6";
import ProductCard from '../components/ProductCard';
import { MdOutlineFavorite, MdOutlineOtherHouses } from "react-icons/md";
import Color from '../components/Color';
import Container from '../components/Container';
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from '../features/products/productSlice';

const OurStore = () => {
  const location = useLocation();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const productState = useSelector((state) => state?.product?.product);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000); // Par défaut, le prix maximum est fixé à 10000
  const [grid, setGrid] = useState(4);
  const [sort, setSort] = useState(''); // Ajout de l'état pour le tri

  const dispatch = useDispatch();

  // Parse URL parameters on component mount and when location changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    const tagParam = searchParams.get('tag');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (brandParam) {
      setSelectedBrand(brandParam);
    }
    if (tagParam) {
      setSelectedTag(tagParam);
    }
  }, [location.search]);

  const handleMinPriceChange = (e) => {
    setMinPrice(parseInt(e.target.value));
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(parseInt(e.target.value));
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  const clearFilters = () => {
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedTag('');
    setMinPrice(0);
    setMaxPrice(10000);
    setSort('');
    dispatch(getAllProducts());
  };

  useEffect(() => {
    let newBrands = [];
    let category = [];
    let newTags = [];
    for (let index = 0; index < productState.length; index++) {
      const element = productState[index];
      newBrands.push(element.brand);
      category.push(element.category);
      newTags.push(element.tags);
    }

    setBrands(newBrands);
    setCategories(category);
    setTags(newTags);
  }, [productState]);

  // Appel initial de l'API pour récupérer les produits
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Fonction pour récupérer les produits en fonction des filtres
  const getProducts = useCallback(() => {
    const filters = {};
    if (selectedBrand) filters.brand = selectedBrand;
    if (selectedCategory) filters.category = selectedCategory;
    if (selectedTag) filters.tags = selectedTag;
    if (minPrice > 0) filters.minPrice = minPrice;
    if (maxPrice < 10000) filters.maxPrice = maxPrice;
    if (sort) filters.sort = sort;

    dispatch(getAllProducts(filters));
  }, [dispatch, selectedBrand, selectedCategory, selectedTag, minPrice, maxPrice, sort]);

  // Gérer les changements dans les filtres
  useEffect(() => {
    if (selectedBrand || selectedCategory || selectedTag || minPrice > 0 || maxPrice < 10000 || sort) {
      getProducts();
    }
  }, [selectedBrand, selectedCategory, selectedTag, minPrice, maxPrice, sort, getProducts]);

  return (
    <div>
      <Meta title={"Our Store"} />
      <BrandCrumb title="Notre Magasin" />
      <Container class1="store-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-3">
            <div className="filter-card mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="filter-title mb-0">Filters</h3>
                <button 
                  className="btn btn-sm btn-outline-danger" 
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="filter-card mb-3">
              <h3 className="filter-title">Product Categories</h3>
              <div>
                <div className="product-tags d-flex flex-wrap align-items-center gap-10">
                  {categories &&
                    [...new Set(categories)].map((item, index) => {
                      return (
                        <span
                          onClick={() => handleCategoryClick(item)}
                          key={index}
                          className={`text-capitalize badge rounded-3 py-2 px-3 ${selectedCategory === item ? 'bg-primary text-white' : 'bg-light text-secondary'}`}
                          style={{ cursor: 'pointer' }}
                        >
                          {item}
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="filter-card mb-3">
              <h3 className="filter-title">Product Tags</h3>
              <div>
                <div className="product-tags d-flex flex-wrap align-items-center gap-10">
                  {tags &&
                    [...new Set(tags)].map((item, index) => {
                      return (
                        <span
                          onClick={() => handleTagClick(item)}
                          key={index}
                          className={`text-capitalize badge rounded-3 py-2 px-3 ${selectedTag === item ? 'bg-primary text-white' : 'bg-light text-secondary'}`}
                          style={{ cursor: 'pointer' }}
                        >
                          {item}
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="filter-card mb-3">
              <h3 className="filter-title">Product Brand</h3>
              <div>
                <div className="product-tags d-flex flex-wrap align-items-center gap-10">
                  {brands &&
                    [...new Set(brands)].map((item, index) => {
                      return (
                        <span
                          onClick={() => handleBrandClick(item)}
                          key={index}
                          className={`text-capitalize badge rounded-3 py-2 px-3 ${selectedBrand === item ? 'bg-primary text-white' : 'bg-light text-secondary'}`}
                          style={{ cursor: 'pointer' }}
                        >
                          {item}
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="filter-card mb-3">
              <h3 className="filter-title">Filtrer par</h3>
              <div>
                <h5 className="sub-title">Prix</h5>
                <input
                  type="number"
                  id="minPriceRange"
                  name="minPriceRange"
                  min={0}
                  max={10000}
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  placeholder="Min Price"
                />
                -
                <input
                  type="number"
                  id="maxPriceRange"
                  name="maxPriceRange"
                  min={0}
                  max={10000}
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  placeholder="Max Price"
                />

                <h5 className="sub-title">Couleurs</h5>
                <div>
                  <Color />
                </div>
              </div>
            </div>
          </div>

          <div className="col-9">
            <div className="filter-sort-grid mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-10">
                  <p className="mb-0 d-block" style={{ width: '100px' }}>
                    Sort By:
                  </p>
                  <select
                    name=""
                    className="form-control form-select"
                    onChange={(e) => setSort(e.target.value)} // Utilisation de la fonction handleSortChange pour mettre à jour sortOption
                  >
                    <option value="manual">En vedette</option>
                    <option value="best-selling">Les plus vendus</option>
                    <option value="title-ascending">Par ordre alphabétique, A-Z</option>
                    <option value="title-descending">Par ordre alphabétique, Z-A</option>
                    <option value="price-ascending">Prix, du plus bas au plus élevé</option>
                    <option value="price-descending">Prix, du plus élevé au plus bas</option>
                    <option value="created-ascending">Date, de la plus ancienne à la plus récente</option>
                    <option value="created-descending">Date, de la plus récente à la plus ancienne</option>
                  </select>
                </div>

                <div className="d-flex gap-10 align-items-center grid">
                  <img
                    onClick={() => setGrid(3)}
                    src="images/gr4.svg"
                    className="d-block img-fluid"
                    alt="grid"
                  />
                  <img
                    onClick={() => setGrid(4)}
                    src="images/gr3.svg"
                    className="d-block img-fluid"
                    alt="grid"
                  />
                  <img
                    onClick={() => setGrid(6)}
                    src="images/gr2.svg"
                    className="d-block img-fluid"
                    alt="grid"
                  />
                </div>
              </div>
            </div>

            <div className="products-list pb-5">
              <div className="d-flex gap-10 flex-wrap">
                <ProductCard data={productState ? productState : []} grid={grid} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OurStore;
