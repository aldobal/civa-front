import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BusesService } from "../services/buses.service";
import { BusBrandsService } from "../services/bus-brands.service";
import { Bus } from "../model/bus.entite";
import { BusBrand } from "../model/bus-brand.model";
import { CreateBusRequest } from "../model/create-bus.request";
import { UpdateBusRequest } from "../model/update-bus.request";
import { PageRequest, PageResponse } from "../../shared/models/page.model";
import { RootState } from "../../auth/redux/store";

const Fleet: React.FC = () => {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageResponse, setPageResponse] = useState<PageResponse<Bus> | null>(null);
    const [pageRequest, setPageRequest] = useState<PageRequest>({ 
        page: 0, 
        size: 10, 
        sortBy: "number", 
        sortDirection: "asc" 
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
    const [busBrands, setBusBrands] = useState<BusBrand[]>([]);
    const [formData, setFormData] = useState<CreateBusRequest>({
        number: '',
        licensePlate: '',
        brandId: 0,
        features: '',
        status: 'ACTIVE'
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    
    const busService = new BusesService();
    const busBrandService = new BusBrandsService();
    const user = useSelector((state: RootState) => state.user);

    const fetchBuses = async () => {
        try {
            setLoading(true);
            const data = await busService.getAllPaginated(pageRequest);
            console.log("Fetched buses data:", data);
            setBuses(data.content || []);
            setPageResponse(data);
        } catch (error) {
            console.error("Error fetching buses:", error);
            setBuses([]);
            setPageResponse(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchBusBrands = async () => {
        try {
            const brands = await busBrandService.getAllBrands();
            setBusBrands(brands);
        } catch (error) {
            console.error("Error fetching bus brands:", error);
            setBusBrands([]);
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        
        if (!formData.number.trim()) {
            errors.number = 'Bus number is required';
        }
        
        if (!formData.licensePlate.trim()) {
            errors.licensePlate = 'License plate is required';
        }
        
        if (!formData.brandId || formData.brandId === 0) {
            errors.brandId = 'Please select a bus brand';
        }
        
        if (!formData.features.trim()) {
            errors.features = 'Features are required';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            number: '',
            licensePlate: '',
            brandId: 0,
            features: '',
            status: 'ACTIVE'
        });
        setFormErrors({});
    };

    useEffect(() => {
        fetchBuses();
    }, [pageRequest]);

    useEffect(() => {
        fetchBusBrands();
    }, []);

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

    // Función para activar un bus
    const handleActivateBus = async (busId: number) => {
        try {
            setLoading(true);
            await busService.activate(busId);
            await fetchBuses(); // Recargar la lista
            alert('Bus activated successfully!');
            console.log(`Bus ${busId} activated successfully`);
        } catch (error) {
            console.error('Error activating bus:', error);
            alert('Error activating bus. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Función para desactivar un bus
    const handleDeactivateBus = async (busId: number) => {
        try {
            setLoading(true);
            await busService.deactivate(busId);
            await fetchBuses(); // Recargar la lista
            alert('Bus deactivated successfully!');
            console.log(`Bus ${busId} deactivated successfully`);
        } catch (error) {
            console.error('Error deactivating bus:', error);
            alert('Error deactivating bus. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Función para abrir modal de eliminación
    const handleDeleteClick = (bus: Bus) => {
        setSelectedBus(bus);
        setShowDeleteModal(true);
    };

    // Función para confirmar eliminación
    const handleDeleteConfirm = async () => {
        if (!selectedBus) return;
        
        try {
            setLoading(true);
            await busService.delete(selectedBus.id);
            await fetchBuses(); // Recargar la lista
            setShowDeleteModal(false);
            setSelectedBus(null);
            console.log(`Bus ${selectedBus.id} deleted successfully`);
        } catch (error) {
            console.error('Error deleting bus:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handler para abrir modal de editar bus
    const handleEditBus = (bus: Bus) => {
        const selectedBrand = busBrands.find(brand => brand.name === bus.brand);
        setFormData({
            number: bus.number,
            licensePlate: bus.licensePlate,
            brandId: selectedBrand?.id || 0,
            features: bus.features || '',
            status: bus.status
        });
        setSelectedBus(bus);
        setFormErrors({});
        setShowEditModal(true);
    };

    // Handler para actualizar un bus
    const handleUpdateBus = async () => {
        if (!validateForm() || !selectedBus) {
            return;
        }

        try {
            setLoading(true);
            const updateRequest: UpdateBusRequest = {
                number: formData.number,
                licensePlate: formData.licensePlate,
                brandId: formData.brandId,
                features: formData.features,
                status: formData.status
            };
            await busService.update(selectedBus.id, updateRequest);
            setShowEditModal(false);
            setSelectedBus(null);
            resetForm();
            await fetchBuses(); // Recargar la lista
            alert('Bus updated successfully!');
        } catch (error) {
            console.error('Error updating bus:', error);
            alert('Error updating bus. Please try again.');
        } finally {
            setLoading(false);
        }
    };    // Handler para abrir modal de crear bus
    const handleAddNewBus = () => {
        resetForm();
        setShowCreateModal(true);
    };

    // Handler para crear un nuevo bus
    const handleCreateBus = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            await busService.create(formData);
            setShowCreateModal(false);
            resetForm();
            await fetchBuses(); // Recargar la lista
            alert('Bus created successfully!');
        } catch (error) {
            console.error('Error creating bus:', error);
            alert('Error creating bus. Please try again.');
        } finally {
            setLoading(false);
        }
    };    return (
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
              <h1 className="text-3xl font-bold text-white mb-2">Fleet Management</h1>
              <p className="text-gray-300">Administrator Dashboard - Welcome, {user.username}!</p>
            </div>
          </div>
        </div>                {/* Controls */}
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-4 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center space-x-3">
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
                            {pageResponse && (
                                <div className="text-gray-300">
                                    Page {pageResponse.page + 1} of {pageResponse.totalPages} 
                                    <span className="text-blue-300 ml-2">({pageResponse.totalElements} total buses)</span>
                                </div>
                            )}
                            
                            {/* Add New Bus Button */}
                            <button
                                onClick={handleAddNewBus}
                                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add New Bus</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading or Table */}
                {loading ? (
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-12 text-center">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-white text-lg">Loading fleet data...</p>
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
                                            onClick={() => handleSortChange("number")}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span>Bus Number</span>
                                                {pageRequest.sortBy === "number" && (
                                                    <span className="text-blue-300">
                                                        {pageRequest.sortDirection === "asc" ? "↑" : "↓"}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-left text-white font-semibold cursor-pointer hover:bg-white/10 transition-colors duration-200"
                                            onClick={() => handleSortChange("licensePlate")}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span>License Plate</span>
                                                {pageRequest.sortBy === "licensePlate" && (
                                                    <span className="text-blue-300">
                                                        {pageRequest.sortDirection === "asc" ? "↑" : "↓"}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Brand</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Features</th>
                                        <th className="px-6 py-4 text-center text-white font-semibold">Status</th>
                                        <th className="px-6 py-4 text-center text-white font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {buses.map((bus, index) => (
                                        <tr key={bus.id} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                                            <td className="px-6 py-4 text-gray-300">
                                                {(pageRequest.page || 0) * (pageRequest.size || 10) + index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white font-medium">{bus.number}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-300 font-mono">{bus.licensePlate}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-blue-300 font-medium">{bus.brand}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {bus.features?.split(",").map((feature, i) => (
                                                        <span 
                                                            key={i}
                                                            className="px-2 py-1 text-xs text-blue-200 bg-blue-500/20 border border-blue-500/30 rounded-full"
                                                        >
                                                            {feature.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    bus.status === "ACTIVE" 
                                                        ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                                                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                                                }`}>
                                                    {bus.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() => handleEditBus(bus)}
                                                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                                                        title="Edit Bus"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    
                                                    {/* Activate/Deactivate Button */}
                                                    {bus.status === "ACTIVE" ? (
                                                        <button
                                                            onClick={() => handleDeactivateBus(bus.id)}
                                                            className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/20 rounded-lg transition-all duration-200"
                                                            title="Deactivate Bus"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                                            </svg>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleActivateBus(bus.id)}
                                                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-all duration-200"
                                                            title="Activate Bus"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDeleteClick(bus)}
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                                                        title="Delete Bus"
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

            {/* Create Bus Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-semibold text-white mb-6">Create New Bus</h3>
                        
                        <form className="space-y-4">
                            {/* Bus Number */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Bus Number</label>
                                <input
                                    type="text"
                                    value={formData.number}
                                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., B001"
                                />
                                {formErrors.number && <p className="text-red-400 text-sm mt-1">{formErrors.number}</p>}
                            </div>

                            {/* License Plate */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">License Plate</label>
                                <input
                                    type="text"
                                    value={formData.licensePlate}
                                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., ABC-123"
                                />
                                {formErrors.licensePlate && <p className="text-red-400 text-sm mt-1">{formErrors.licensePlate}</p>}
                            </div>

                            {/* Bus Brand */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Bus Brand</label>
                                <select
                                    value={formData.brandId}
                                    onChange={(e) => setFormData({ ...formData, brandId: Number(e.target.value) })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value={0} className="bg-gray-800">Select a brand</option>
                                    {busBrands.map((brand) => (
                                        <option key={brand.id} value={brand.id} className="bg-gray-800">
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.brandId && <p className="text-red-400 text-sm mt-1">{formErrors.brandId}</p>}
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Features</label>
                                <textarea
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="e.g., Air conditioning, WiFi, USB ports"
                                    rows={3}
                                />
                                {formErrors.features && <p className="text-red-400 text-sm mt-1">{formErrors.features}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="ACTIVE" className="bg-gray-800">Active</option>
                                    <option value="INACTIVE" className="bg-gray-800">Inactive</option>
                                </select>
                            </div>
                        </form>
                        
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetForm();
                                }}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateBus}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Bus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Bus Modal */}
            {showEditModal && selectedBus && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-semibold text-white mb-6">Edit Bus</h3>
                        
                        <form className="space-y-4">
                            {/* Bus Number */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Bus Number</label>
                                <input
                                    type="text"
                                    value={formData.number}
                                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., B001"
                                />
                                {formErrors.number && <p className="text-red-400 text-sm mt-1">{formErrors.number}</p>}
                            </div>

                            {/* License Plate */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">License Plate</label>
                                <input
                                    type="text"
                                    value={formData.licensePlate}
                                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., ABC-123"
                                />
                                {formErrors.licensePlate && <p className="text-red-400 text-sm mt-1">{formErrors.licensePlate}</p>}
                            </div>

                            {/* Bus Brand */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Bus Brand</label>
                                <select
                                    value={formData.brandId}
                                    onChange={(e) => setFormData({ ...formData, brandId: Number(e.target.value) })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value={0} className="bg-gray-800">Select a brand</option>
                                    {busBrands.map((brand) => (
                                        <option key={brand.id} value={brand.id} className="bg-gray-800">
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.brandId && <p className="text-red-400 text-sm mt-1">{formErrors.brandId}</p>}
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Features</label>
                                <textarea
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="e.g., Air conditioning, WiFi, USB ports"
                                    rows={3}
                                />
                                {formErrors.features && <p className="text-red-400 text-sm mt-1">{formErrors.features}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="ACTIVE" className="bg-gray-800">Active</option>
                                    <option value="INACTIVE" className="bg-gray-800">Inactive</option>
                                </select>
                            </div>
                        </form>
                        
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedBus(null);
                                    resetForm();
                                }}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateBus}
                                disabled={loading}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Bus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedBus && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-semibold text-white mb-4">Confirm Deletion</h3>
                        <p className="text-white/80 mb-6">
                            Are you sure you want to delete bus <strong>{selectedBus.number}</strong>? This action cannot be undone.
                        </p>
                        
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedBus(null);
                                }}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={loading}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fleet;
