import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ChevronDown } from "lucide-react";
import { useApi } from "../../context/ApiContext";
import ConfirmationPopup from "../../components/admin/ConfirmationPopup";
import Pagination from "../../components/admin/Pagination";
import DynamicTable from "../../components/admin/DynamicTable";
import AdvertisementTypePopup from "../../components/admin/AdvertisementTypePopup";
import AdvertisementFormPopup from "../../components/admin/AdvertisementFormPopup";
import {
  createAd,
  deleteAd,
  fetchBannerAds,
  fetchSquareAds,
  updateAd,
} from "../../services/advertisementService";

function AdminAdvertisementPage() {
  const { baseURL } = useApi();
  const [advertisements, setAdvertisements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false);
  const [selectedAdType, setSelectedAdType] = useState(null);
  const [editingAd, setEditingAd] = useState(null);
  const [filterPageType, setFilterPageType] = useState("All");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const ITEMS_PER_PAGE = 10;

  /* ================= LOAD ADS ================= */
  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    const [banners, squares] = await Promise.all([
      fetchBannerAds(baseURL),
      fetchSquareAds(baseURL),
    ]);

    const formattedBanners = (banners || []).map((ad) => ({
      ...ad,
      adType: "banner",
      imageUrl: ad.image ? `${baseURL}/${ad.image.replace(/\\/g, "/")}` : null,
      status: ad.status ? "Active" : "Inactive",
      pageType: ad.page_type,
      showContactButton: !!ad.show_contact,
    }));

    const formattedSquares = (squares || []).map((ad) => ({
      ...ad,
      adType: "square",
      imageUrl: ad.image ? `${baseURL}/${ad.image.replace(/\\/g, "/")}` : null,
      status: ad.status ? "Active" : "Inactive",
      pageType: ad.page_type,
      showContactButton: !!ad.show_contact,
    }));

    const formatted = [...formattedBanners, ...formattedSquares].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    setAdvertisements(formatted);
  };

  const pageTypes = [
    "All",
    ...new Set(advertisements.map((ad) => ad.pageType)),
  ];

  const filteredAds = advertisements.filter(
    (ad) => filterPageType === "All" || ad.pageType === filterPageType
  );

  // Pagination logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentAds = filteredAds.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAds.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleFilterChange = (e) => {
    setFilterPageType(e.target.value);
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    setIsTypeSelectionOpen(true);
  };

  const handleTypeSelect = (type) => {
    setIsTypeSelectionOpen(false);
    setSelectedAdType(type);
    setEditingAd(null);
    setIsPopupOpen(true);
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setIsPopupOpen(true);
  };

  const handleDelete = (ad) => {
    setAdToDelete(ad);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (!adToDelete) return;
    setIsDeleting(true);
    try {
      await deleteAd(baseURL, adToDelete.adType, adToDelete.id);
      loadAds();
      setIsDeletePopupOpen(false);
      setAdToDelete(null);
    } catch (err) {
      console.error("Error deleting advertisement");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const fd = new FormData();

      fd.append("title", formData.title);
      fd.append("page_type", formData.pageType);
      fd.append("order", String(formData.order));
      fd.append("link", formData.link || "");
      fd.append("status", formData.status === "Active" ? "true" : "false");
      fd.append("show_contact", formData.showContactButton ? "true" : "false");

      if (!editingAd) {
        fd.append("created_at", new Date().toISOString());
      }

      if (formData.imageFile) {
        fd.append("image", formData.imageFile);
      }

      if (editingAd) {
        await updateAd(baseURL, editingAd.adType, editingAd.id, fd);
      } else {
        await createAd(baseURL, formData.adType, fd);
      }

      setIsPopupOpen(false);
      setEditingAd(null);
      setSelectedAdType(null);
      loadAds();
    } catch (err) {
      console.error("Failed to save advertisement", err);
    }
  };

  const columns = [
    {
      header: "Sl. No.",
      cell: (_, index) => <span>{indexOfFirstItem + index + 1}</span>,
    },
    {
      header: "Image",
      accessor: "imageUrl",
      type: "image",
    },
    {
      header: "Title",
      accessor: "title",
      cellClassName: "font-medium text-gray-900 max-w-xs truncate",
    },
    {
      header: "Page Type",
      accessor: "pageType",
    },
    {
      header: "Ad Type",
      accessor: "adType",
      cell: (row) => (
        <span className="capitalize inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {row.adType}
        </span>
      ),
    },
    {
      header: "Order",
      accessor: "order",
      cellClassName: "text-center",
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
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
      headerClassName: "text-right",
      cellClassName: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-800 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            Advertisement Management
          </h1>
          <p className="text-gray-700 mt-1 text-sm md:text-base">
            Manage ad placements across the site.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full sm:w-auto relative">
            <label htmlFor="pageTypeFilter" className="sr-only">
              Filter by Page Type
            </label>
            <select
              id="pageTypeFilter"
              value={filterPageType}
              onChange={handleFilterChange}
              className="w-full appearance-none bg-white cursor-pointer pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red transition-colors"
            >
              {pageTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-brand-red text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-all w-full md:w-auto justify-center cursor-pointer"
          >
            <Plus size={20} />
            Add Advertisement
          </button>
        </div>
      </div>

      <DynamicTable columns={columns} data={currentAds} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <AdvertisementTypePopup
        isOpen={isTypeSelectionOpen}
        onClose={() => setIsTypeSelectionOpen(false)}
        onSelect={handleTypeSelect}
      />

      <AdvertisementFormPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleFormSubmit}
        advertisement={editingAd}
        adType={editingAd?.adType || selectedAdType}
      />

      <ConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Advertisement"
        message={`Are you sure you want to delete?`}
        confirmText="Delete"
        isConfirming={isDeleting}
      />
    </div>
  );
}

export default AdminAdvertisementPage;
