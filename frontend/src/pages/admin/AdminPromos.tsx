import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2,
  Check,
  X,
  Calendar,
  Tag,
  CreditCard,
  Search
} from 'lucide-react';
import { PromoCode } from '../../types';

// Mock data for promo codes
const mockPromoCodes: PromoCode[] = [
  {
    id: 'promo1',
    code: 'WELCOME10',
    discountPercent: 10,
    validFrom: '2023-01-01T00:00:00.000Z',
    validUntil: '2025-12-31T23:59:59.999Z',
    isActive: true,
    usageLimit: 0,
    usageCount: 125
  },
  {
    id: 'promo2',
    code: 'SUMMER20',
    discountPercent: 20,
    validFrom: '2023-05-01T00:00:00.000Z',
    validUntil: '2023-08-31T23:59:59.999Z',
    isActive: false,
    usageLimit: 500,
    usageCount: 342
  },
  {
    id: 'promo3',
    code: 'STUDENT15',
    discountPercent: 15,
    validFrom: '2023-01-01T00:00:00.000Z',
    validUntil: '2025-12-31T23:59:59.999Z',
    isActive: true,
    usageLimit: 0,
    usageCount: 231
  },
  {
    id: 'promo4',
    code: 'FACULTY25',
    discountPercent: 25,
    validFrom: '2023-01-01T00:00:00.000Z',
    validUntil: '2025-12-31T23:59:59.999Z',
    isActive: true,
    usageLimit: 1000,
    usageCount: 87
  }
];

const AdminPromos: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showActive, setShowActive] = useState<boolean | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPromo, setCurrentPromo] = useState<PromoCode | null>(null);
  
  // Form state for add/edit
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: '',
    validFrom: '',
    validUntil: '',
    isActive: true,
    usageLimit: '',
  });

  useEffect(() => {
    // In a real app, we would fetch this data from the API
    const fetchPromoCodes = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPromoCodes(mockPromoCodes);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPromoCodes();
  }, []);

  // Filter promo codes based on search and active status
  const filteredPromoCodes = promoCodes.filter(promo => {
    const matchesSearch = promo.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = showActive === null || promo.isActive === showActive;
    
    return matchesSearch && matchesActive;
  });

  // Modal handlers
  const openAddModal = () => {
    const today = new Date().toISOString().split('T')[0];
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    setFormData({
      code: '',
      discountPercent: '',
      validFrom: today,
      validUntil: oneYearFromNow.toISOString().split('T')[0],
      isActive: true,
      usageLimit: '',
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (promo: PromoCode) => {
    setCurrentPromo(promo);
    setFormData({
      code: promo.code,
      discountPercent: promo.discountPercent.toString(),
      validFrom: new Date(promo.validFrom).toISOString().split('T')[0],
      validUntil: new Date(promo.validUntil).toISOString().split('T')[0],
      isActive: promo.isActive,
      usageLimit: promo.usageLimit ? promo.usageLimit.toString() : '',
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (promo: PromoCode) => {
    setCurrentPromo(promo);
    setIsDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentPromo(null);
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would submit to the API
    const newPromo: PromoCode = {
      id: `promo-${Date.now()}`,
      code: formData.code.toUpperCase(),
      discountPercent: parseFloat(formData.discountPercent),
      validFrom: new Date(formData.validFrom).toISOString(),
      validUntil: new Date(formData.validUntil).toISOString(),
      isActive: formData.isActive,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : 0,
      usageCount: 0
    };
    
    setPromoCodes(prev => [...prev, newPromo]);
    closeAllModals();
  };

  const handleEditPromo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPromo) return;
    
    // In a real app, we would submit to the API
    const updatedPromo: PromoCode = {
      ...currentPromo,
      code: formData.code.toUpperCase(),
      discountPercent: parseFloat(formData.discountPercent),
      validFrom: new Date(formData.validFrom).toISOString(),
      validUntil: new Date(formData.validUntil).toISOString(),
      isActive: formData.isActive,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : 0,
    };
    
    setPromoCodes(prev => prev.map(promo => 
      promo.id === currentPromo.id ? updatedPromo : promo
    ));
    closeAllModals();
  };

  const handleDeletePromo = () => {
    if (!currentPromo) return;
    
    // In a real app, we would submit to the API
    setPromoCodes(prev => prev.filter(promo => promo.id !== currentPromo.id));
    closeAllModals();
  };

  const togglePromoStatus = (promoId: string) => {
    setPromoCodes(prev => prev.map(promo => 
      promo.id === promoId ? { ...promo, isActive: !promo.isActive } : promo
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold dark:text-white">Manage Promo Codes</h1>
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Add New Promo
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by promo code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowActive(null)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  showActive === null
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setShowActive(true)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  showActive === true
                    ? 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setShowActive(false)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  showActive === false
                    ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-300'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>
        
        {/* Promo Codes Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Discount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Valid Period
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Usage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPromoCodes.map((promo) => (
                  <tr key={promo.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 rounded-md bg-orange-100 dark:bg-orange-900/30 mr-3">
                          <Tag size={16} className="text-orange-600 dark:text-orange-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {promo.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                        {promo.discountPercent}% OFF
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(promo.validFrom).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        to {new Date(promo.validUntil).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {promo.usageCount} uses
                      </div>
                      {promo.usageLimit > 0 && (
                        <div className="mt-1 h-1.5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 dark:bg-blue-500" 
                            style={{ width: `${Math.min(100, (promo.usageCount / promo.usageLimit) * 100)}%` }}
                          ></div>
                        </div>
                      )}
                      {promo.usageLimit > 0 ? (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Limit: {promo.usageLimit}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          No usage limit
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePromoStatus(promo.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          promo.isActive 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' 
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {promo.isActive ? (
                          <>
                            <Check size={14} className="mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <X size={14} className="mr-1" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(promo)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(promo)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPromoCodes.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No promo codes found. Try adjusting your filters or add a new promo code.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Promo Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold dark:text-white">Add New Promo Code</h2>
              <button onClick={closeAllModals} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddPromo} className="p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Promo Code
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        required
                        placeholder="SUMMER20"
                        className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Code will be stored in uppercase.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="discountPercent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Discount Percentage
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="discountPercent"
                        name="discountPercent"
                        value={formData.discountPercent}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="100"
                        placeholder="20"
                        className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="validFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Valid From
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <div className="relative flex items-stretch flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="validFrom"
                          name="validFrom"
                          value={formData.validFrom}
                          onChange={handleInputChange}
                          required
                          className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Valid Until
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <div className="relative flex items-stretch flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="validUntil"
                          name="validUntil"
                          value={formData.validUntil}
                          onChange={handleInputChange}
                          required
                          className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Usage Limit (Optional)
                  </label>
                  <input
                    type="number"
                    id="usageLimit"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Leave blank for unlimited"
                    className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave blank or set to 0 for unlimited usage.
                  </p>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Promo code is active
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                >
                  Create Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Promo Modal */}
      {isEditModalOpen && currentPromo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold dark:text-white">Edit Promo Code</h2>
              <button onClick={closeAllModals} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditPromo} className="p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Promo Code
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="edit-code"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        required
                        className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="edit-discountPercent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Discount Percentage
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="edit-discountPercent"
                        name="discountPercent"
                        value={formData.discountPercent}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="100"
                        className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-validFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Valid From
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <div className="relative flex items-stretch flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="edit-validFrom"
                          name="validFrom"
                          value={formData.validFrom}
                          onChange={handleInputChange}
                          required
                          className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-validUntil" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Valid Until
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <div className="relative flex items-stretch flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="edit-validUntil"
                          name="validUntil"
                          value={formData.validUntil}
                          onChange={handleInputChange}
                          required
                          className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="edit-usageLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Usage Limit (Optional)
                  </label>
                  <input
                    type="number"
                    id="edit-usageLimit"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Leave blank for unlimited"
                    className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Current usage: {currentPromo.usageCount}. Leave blank or set to 0 for unlimited usage.
                  </p>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="edit-isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Promo code is active
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentPromo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Delete Promo Code</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete the promo code <span className="font-semibold">{currentPromo.code}</span>? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeletePromo}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromos;