import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { auth } from '../firebase';

const ProductDetail = () => {
  const { productId } = useParams();
  const { user, credits, useCredits, login } = useUser();
  const [product, setProduct] = useState(null);
  const [showDemo, setShowDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOpening, setIsOpening] = useState(false);

  // Fetch product from backend using productId
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/${productId}`);
        setProduct(res.data.product);
      } catch (error) {
        console.error("Product not found or error fetching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Show loading
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin-slow"></div>
        <p className="text-gray-700 dark:text-white text-lg font-medium">
          Loading
        </p>
      </div>
    </div>
  );
}

  // Show 404 if not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/products" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Try Now Button Click
const handleTryNow = async () => {
  if (!user) {
    window.location.href = '/signup';
    return;
  }

  if (credits < product.creditCost) {
    alert('Insufficient credits! Please upgrade your plan or buy more credits.');
    return;
  }

  const firebaseUser = auth.currentUser;

  if (!firebaseUser) {
    alert("Please log in again.");
    return;
  }

  setIsOpening(true); 

  const token = await firebaseUser.getIdToken();

  try {
const res = await axios.post(`/products/${productId}/use`,{},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = res.data;
    
    if (data.success) {
      await login(); // refresh user credits

      // Open correct product link
      if (productId === 'code-formatter-pro') {
        window.open('https://prettier.io/playground', '_blank');
      } else if (productId === 'api-tester-ultimate') {
        window.open('https://hoppscotch.io/', '_blank');
      } else if (productId === 'resume-builder-studio') {
        window.open('https://rb-react.vercel.app/', '_blank');
      }
    } else {
      alert(data.message || 'Something went wrong using the product.');
    }

  } catch (error) {
    console.error("Error using product:", error);
    alert('An error occurred while trying to use the product.');
  } finally {
    setTimeout(() => setIsOpening(false), 3000); 
  }
};

  const gradientColor = product.color || 'from-blue-500 to-blue-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li><Link to="/products" className="hover:text-blue-600 dark:hover:text-blue-400">Products</Link></li>
            <li>→</li>
            <li className="text-gray-900 dark:text-white">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Section */}
          <div className="lg:col-span-2">
            {/* Product Info */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-5xl">
                  {{
                    'code-formatter-pro': '🚀',
                    'api-tester-ultimate': '🔧',
                    'resume-builder-studio': '📄'
                  }[productId]}
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                  <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                  {product.thumbnail}
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                  {product.creditCost} credits per use
                </span>
              </div>
            </div>

            {/* About */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Tool</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">{product.about}</p>
            </section>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-green-500 text-xl">✓</div>
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Demo */}
            {showDemo && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Demo Result</h2>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Input:</h3>
                    <code className="block bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm">
                      {product.demoContent}
                    </code>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Output:</h3>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                      {product.formattedDemo}
                    </pre>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {product.creditCost} Credits
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">per use</div>
                </div>

                {user ? (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Credits</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{credits}</p>
                    </div>

<button
  onClick={handleTryNow}
  disabled={credits < product.creditCost || isOpening}
  className={`w-full px-6 py-3 font-medium rounded-lg transition-all duration-200 ${
    credits >= product.creditCost && !isOpening
      ? 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg transform hover:scale-105'
      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
  }`}
>
  {isOpening
    ? 'Opening...'
    : credits >= product.creditCost
    ? `Try Now - ${product.creditCost} Credits`
    : 'Insufficient Credits'}
</button>


                    {credits < product.creditCost && (
                      <Link
                        to="/pricing"
                        className="block w-full mt-3 px-6 py-3 border border-blue-500 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-center transition-all duration-200"
                      >
                        Buy More Credits
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                  <Link
                    to="/signup"
                    className="block w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 text-center transition-all duration-200"
                  >
                    Start Free Trial
                  </Link>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Get 100 free credits to try this tool
                    </p>
                  </>
                )}
              </div>

              {/* Pro Tip */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Pro Tip</h3>
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  Need to use this tool frequently? Consider upgrading to a Pro plan for better value and unlimited access.
                </p>
                <Link
                  to="/pricing"
                  className="inline-block mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  View Plans →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
