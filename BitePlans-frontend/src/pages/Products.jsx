import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import { useUser } from '../context/UserContext';
import { auth } from '../firebase';
import axios from 'axios';

const Products = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchCredits, login } = useUser();
  const [openingProductId, setOpeningProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products');
        const data = res.data;
        if (data.success) {
          setTools(data.data);
        } else {
          console.error("Failed to load products:", data.message);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

const handleUseProduct = async (productId, productName) => {
  try {
    setOpeningProductId(productId); 

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first to use this product.");
      setOpeningProductId(null); 
      return;
    }

    const token = await user.getIdToken();

const res = await axios.post(`/products/${productId}/use`,{},
  {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
);

const data = res.data;

    if (res.status === 401) {
      alert("Unauthorized. Please login again.");
      setOpeningProductId(null);
      return;
    }

    if (data.success) {
      await login();

      // Open specific product link in new tab
      if (productName === 'Code Formatter Pro') {
        window.open('https://prettier.io/playground', '_blank');
      } else if (productName === 'API Tester Ultimate') {
        window.open('https://hoppscotch.io/', '_blank');
      } else if (productName === 'Resume Builder Studio') {
        window.open('https://rb-react.vercel.app/', '_blank');
      }
    } else {
      alert(data.message || 'Failed to use product.');
    }
  } catch (error) {
    console.error("Error using product:", error);
    alert('Something went wrong while using the product.');
  } finally {
    setTimeout(() => setOpeningProductId(null), 3000); 
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin-slow"></div>
          <p className="text-gray-700 dark:text-white text-lg font-medium">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Developer Tools</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover powerful tools to enhance your development workflow. Each tool uses credits based on complexity and value.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {tools.map((tool, idx) => {
            const gradients = ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600'];
            const emojis = ['🚀', '🔧', '📄'];

            return (
              <div
                key={tool._id}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${gradients[idx % 3]} p-6 text-white h-52 flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl">{emojis[idx % 3]}</div>
                    <div className="text-right">
                      <div className="text-sm opacity-90">Credits per use</div>
                      <div className="text-2xl font-bold">{tool.creditCost}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{tool.name}</h3>
                    <p className="text-white/90 text-sm leading-snug">{tool.description}</p>
                    <div className="mt-2">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{tool.thumbnail}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Key Features:</h4>
                  <ul className="space-y-2 mb-6">
                    {tool.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col space-y-3">
<button
  onClick={() => handleUseProduct(tool.productId, tool.name)}
  disabled={openingProductId === tool.productId}
  className={`w-full px-4 py-3 bg-gradient-to-r ${gradients[idx % 3]} text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center ${
    openingProductId === tool.productId ? 'opacity-70 cursor-not-allowed' : ''
  }`}
>
  {openingProductId === tool.productId ? 'Opening...' : `Try Now - ${tool.creditCost} Credits`}
</button>

                    <Link
                      to={`/products/${tool.productId}`}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 text-center"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need More Credits?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Upgrade to a premium plan for more credits and unlimited access to all tools.
            </p>
            <Link
              to="/pricing"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
