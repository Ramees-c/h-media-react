import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ChevronDown } from "lucide-react";
import DynamicTable from "../../components/admin/DynamicTable";
import Pagination from "../../components/admin/Pagination";
import ConfirmationPopup from "../../components/admin/ConfirmationPopup";
import FullScreenAdFormPopup from "../../components/admin/FullScreenAdFormPopup";
import { useApi } from "../../context/ApiContext";

function AdminFullScreenAd() {
  const { baseURL } = useApi();
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterPageType, setFilterPageType] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Popup states
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    // Mock data
    const mockAds = [
      {
        id: 1,
        image: "https://via.placeholder.com/150",
        title: "Sample Full Screen Ad 1",
        pageType: "Home",
        status: "Active",
      },
      {
        id: 2,
        image: "https://via.placeholder.com/150",
        title: "Sample Full Screen Ad 2",
        pageType: "All",
        status: "Inactive",
      },
    ];
    setAds(mockAds);
  }, []);

  const handleAddNew = () => {
    setEditingAd(null);
    setIsPopupOpen(true);
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setIsPopupOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    console.log("Form Data:", formData);
    // Mock update
    if (editingAd) {
      setAds(prev => prev.map(ad => ad.id === editingAd.id ? { ...ad, ...formData, image: formData.imageFile ? URL.createObjectURL(formData.imageFile) : ad.image } : ad));
    } else {
      setAds(prev => [{ id: Date.now(), ...formData, image: formData.imageFile ? URL.createObjectURL(formData.imageFile) : "https://via.placeholder.com/150" }, ...prev]);
    }
    
    setIsPopupOpen(false);
    setEditingAd(null);
  };

  const handleDelete = (ad) => {
    setAdToDelete(ad);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (!adToDelete) return;
    setIsDeleting(true);
    try {
      // await deleteFullScreenAd(baseURL, adToDelete.id);
      setAds((prev) => prev.filter((a) => a.id !== adToDelete.id));
      setIsDeletePopupOpen(false);
      setAdToDelete(null);
    } catch (error) {
      console.error("Failed to delete ad");
    } finally {
      setIsDeleting(false);
    }
  };

  const pageTypes = ["All", ...new Set(ads.map((ad) => ad.pageType))];

  const filteredAds = ads.filter(
    (ad) => filterPageType === "All" || ad.pageType === filterPageType
  );

  const handleFilterChange = (type) => {
    setFilterPageType(type);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  const columns = [
    {
      header: "Sl. No.",
      cell: (_, index) => (
        <span>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>
      ),
    },
    {
      header: "Title",
      accessor: "title",
      cellClassName: "font-medium text-gray-900",
    },
    {
      header: "Image",
      accessor: "image",
      type: "image",
    },
    {
      header: "Page Type",
      accessor: "pageType",
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  // Pagination logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentAds = filteredAds.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAds.length / ITEMS_PER_PAGE);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Full Screen Advertisement
          </h1>
          <p className="text-gray-700 mt-1 text-sm md:text-base">
            Manage full screen advertisements.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full sm:w-auto relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full sm:w-60 bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-brand-red transition-all cursor-pointer"
            >
              <span>{filterPageType}</span>
              <ChevronDown
                size={20}
                className="text-gray-400 transition-transform"
              />
            </button>

            {isDropdownOpen && (
              <ul className="absolute z-50 mt-1 sm:w-60 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {pageTypes.map((type) => (
                  <li
                    key={type}
                    onClick={() => handleFilterChange(type)}
                    className="cursor-pointer px-4 py-2 hover:bg-brand-red hover:text-white transition-colors"
                  >
                    {type}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-brand-red text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-all cursor-pointer w-full md:w-auto justify-center"
          >
            <Plus size={20} />
            Add Full Screen Ad
          </button>
        </div>
      </div>

      <DynamicTable columns={columns} data={currentAds} />

      {filteredAds.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <FullScreenAdFormPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleFormSubmit}
        ad={editingAd}
      />

      <ConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Advertisement"
        message="Are you sure you want to delete this ad?"
        isConfirming={isDeleting}
      />
    </div>
  );
}

export default AdminFullScreenAd;