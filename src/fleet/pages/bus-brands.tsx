import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BusBrandsService } from "../services/bus-brands.service";
import { BusBrand, BusBrandDependencies } from "../model/bus-brand.model";
import { CreateBusBrandRequest } from "../model/create-bus-brand.request";
import { PageRequest, PageResponse } from "../../shared/models/page.model";
import { RootState } from "../../auth/redux/store";

const BusBrandsManagement: React.FC = () => {
    const [brands, setBrands] = useState<BusBrand[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageResponse, setPageResponse] = useState<PageResponse<BusBrand> | null>(null);
    const [pageRequest, setPageRequest] = useState<PageRequest>({ 
        page: 0, 
        size: 10, 
        sortBy: "name", 
        sortDirection: "asc" 
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<BusBrand | null>(null);
    const [dependencies, setDependencies] = useState<BusBrandDependencies | null>(null);
    const [createRequest, setCreateRequest] = useState<CreateBusBrandRequest>({ name: "" });
    const [editRequest, setEditRequest] = useState<CreateBusBrandRequest>({ name: "" });
    
    const brandService = new BusBrandsService();
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        fetchBrands();
    }, [pageRequest, searchTerm]);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            let data;
            
            if (searchTerm.trim()) {
                data = await brandService.searchByName(searchTerm, pageRequest);
            } else {
                data = await brandService.getAllPaginated(pageRequest);
            }
            
            setBrands(data.content || []);
            setPageResponse(data);
        } catch (error) {
            console.error("Error fetching brands:", error);
            setBrands([]);
            setPageResponse(null);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPageRequest({ ...pageRequest, page: newPage });
    };

    const handleSizeChange = (newSize: number) => {
        setPageRequest({ ...pageRequest, page: 0, size: newSize });
    };

    const handleSortChange = (sortBy: string) => {
        const newDirection = pageRequest.sortBy === sortBy && pageRequest.sortDirection === "asc" ? "desc" : "asc";
        setPageRequest({ ...pageRequest, page: 0, sortBy, sortDirection: newDirection });
    };

    const handleCreateBrand = async () => {
        try {
            await brandService.create(createRequest);
            setShowCreateModal(false);
            setCreateRequest({ name: "" });
            fetchBrands();
        } catch (error) {
            console.error("Error creating brand:", error);
        }
    };

    const handleDeleteClick = async (brand: BusBrand) => {
        try {
            const deps = await brandService.getDependencies(brand.id);
            setDependencies(deps);
            setSelectedBrand(brand);
            setShowDeleteModal(true);
        } catch (error) {
            console.error("Error getting dependencies:", error);
        }
    };

    const handleDeleteConfirm = async (force: boolean = false) => {
        if (!selectedBrand) return;
        
        try {
            if (force) {
                await brandService.forceDelete(selectedBrand.id);
            } else {
                await brandService.delete(selectedBrand.id);
            }
            setShowDeleteModal(false);
            setSelectedBrand(null);
            setDependencies(null);
            fetchBrands();
        } catch (error) {
            console.error("Error deleting brand:", error);
        }
    };

    const handleEditClick = (brand: BusBrand) => {
        setSelectedBrand(brand);
        setEditRequest({ name: brand.name });
        setShowEditModal(true);
    };

    const handleEditSubmit = async () => {
        if (!selectedBrand || !editRequest.name.trim()) return;
        
        try {
            setLoading(true);
            await brandService.update(selectedBrand.id, editRequest);
            setShowEditModal(false);
            setSelectedBrand(null);
            setEditRequest({ name: "" });
            await fetchBrands();
            alert('Bus brand updated successfully!');
        } catch (error) {
            console.error("Error updating brand:", error);
            alert('Error updating bus brand. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse pointer-events-none" style={{animationDelay: '2s'}}></div>
            
            {/* Main Content */}
            <div className="relative z-10 container mx-auto p-6">
                {/* Header */}
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Bus Brands Management</h1>
                            <p className="text-gray-300">Administrator Dashboard - Welcome, {user.username}!</p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-4 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex items-center space-x-4">
                            <label className="text-white font-medium">Items per page:</label>
                            <select 
                                value={pageRequest.size} 
                                onChange={(e) => handleSizeChange(Number(e.target.value))}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={5} className="bg-gray-800">5</option>
                                <option value={10} className="bg-gray-800">10</option>
                                <option value={20} className="bg-gray-800">20</option>
                                <option value={50} className="bg-gray-800">50</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {/* Search */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Search brands..."
                                />
                            </div>
                            
                            {pageResponse && (
                                <div className="text-gray-300">
                                    Page {pageResponse.page + 1} of {pageResponse.totalPages} 
                                    <span className="text-blue-300 ml-2">({pageResponse.totalElements} total brands)</span>
                                </div>
                            )}
                            
                            {/* Add New Brand Button */}
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Brand</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading or Table */}
                {loading ? (
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-12 text-center">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-white text-lg">Loading brands data...</p>
                        </div>
                    </div>
                ) : (
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="px-6 py-4 text-left text-white font-semibold">#</th>
                                        <th 
                                            className="px-6 py-4 text-left text-white font-semibold cursor-pointer hover:bg-white/10 transition-colors duration-200"
                                            onClick={() => handleSortChange("name")}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span>Brand Name</span>
                                                {pageRequest.sortBy === "name" && (
                                                    <span className="text-blue-300">
                                                        {pageRequest.sortDirection === "asc" ? "↑" : "↓"}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-center text-white font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brands.map((brand, index) => (
                                        <tr key={brand.id} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                                            <td className="px-6 py-4 text-gray-300">
                                                {(pageRequest.page || 0) * (pageRequest.size || 10) + index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white font-medium text-lg">{brand.name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() => handleEditClick(brand)}
                                                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                                                        title="Edit Brand"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDeleteClick(brand)}
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                                                        title="Delete Brand"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {pageResponse && pageResponse.totalPages > 1 && (
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-6 mt-6">
                        <div className="flex justify-center space-x-2">
                            <button 
                                onClick={() => handlePageChange(pageResponse.page - 1)}
                                disabled={pageResponse.first}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {Array.from({ length: Math.min(5, pageResponse.totalPages) }, (_, i) => {
                                const pageNum = Math.max(0, pageResponse.page - 2) + i;
                                if (pageNum >= pageResponse.totalPages) return null;
                                return (
                                    <button 
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                            pageNum === pageResponse.page 
                                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                                                : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                                        }`}
                                    >
                                        {pageNum + 1}
                                    </button>
                                );
                            })}
                            <button 
                                onClick={() => handlePageChange(pageResponse.page + 1)}
                                disabled={pageResponse.last}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Brand Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Create New Brand</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
                                <input
                                    type="text"
                                    value={createRequest.name}
                                    onChange={(e) => setCreateRequest({ name: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter brand name"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleCreateBrand}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setCreateRequest({ name: "" });
                                    }}
                                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Brand Modal */}
            {showEditModal && selectedBrand && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Edit Brand: {selectedBrand.name}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
                                <input
                                    type="text"
                                    value={editRequest.name}
                                    onChange={(e) => setEditRequest({ name: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter brand name"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleEditSubmit}
                                    disabled={loading || !editRequest.name.trim()}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Updating...' : 'Update'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedBrand(null);
                                        setEditRequest({ name: "" });
                                    }}
                                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedBrand && dependencies && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold text-white mb-4">Delete Brand: {selectedBrand.name}</h3>
                        
                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                                    <div className="text-2xl font-bold text-green-300">{dependencies.activeBusesCount}</div>
                                    <div className="text-xs text-green-400">Active Buses</div>
                                </div>
                                <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3">
                                    <div className="text-2xl font-bold text-orange-300">{dependencies.inactiveBusesCount}</div>
                                    <div className="text-xs text-orange-400">Inactive Buses</div>
                                </div>
                                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                                    <div className="text-2xl font-bold text-blue-300">{dependencies.totalBusesCount}</div>
                                    <div className="text-xs text-blue-400">Total Buses</div>
                                </div>
                            </div>
                            
                            {dependencies.canBeDeleted ? (
                                <div className="text-green-400 text-sm">
                                    ✅ This brand can be safely deleted (no active buses).
                                </div>
                            ) : (
                                <div className="text-red-400 text-sm">
                                    ⚠️ This brand has {dependencies.activeBusesCount} active buses. 
                                    Normal deletion will fail.
                                </div>
                            )}
                        </div>
                        
                        <div className="flex space-x-3">
                            {dependencies.canBeDeleted ? (
                                <button
                                    onClick={() => handleDeleteConfirm(false)}
                                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                                >
                                    Delete Brand
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleDeleteConfirm(true)}
                                    className="flex-1 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                                >
                                    Force Delete (+ All Buses)
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedBrand(null);
                                    setDependencies(null);
                                }}
                                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusBrandsManagement;