import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ChevronLeft, Loader2 } from "lucide-react";
import Pagination from "../../components/admin/Pagination";
import DynamicTable from "../../components/admin/DynamicTable";
import ConfirmationPopup from "../../components/admin/ConfirmationPopup";
import AddArticle from "../../components/admin/AddArticle";
import { useApi } from "../../context/ApiContext";
import {
  fetchMoreNews,
  addMoreNews,
  updateMoreNews,
  deleteMoreNews,
} from "../../services/moreNewsService";

function AdminMoreNewsPage() {
  const { baseURL } = useApi();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("list"); // list | add | edit
  const [editingArticle, setEditingArticle] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const ITEMS_PER_PAGE = 10;

  // --------------------------
  // LOAD DATA
  // --------------------------
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMoreNews(baseURL);
      const sortedData = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      const formatted = sortedData.map((item) => ({
        ...item,
        imageUrl: item.image
          ? `${baseURL}/${item.image.replace(/\\/g, "/")}`
          : "/placeholder.jpg",
        publishedDate: item.date.split("T")[0],
      }));

      setList(formatted);
    } catch (err) {
      console.error("Error loading More News");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------
  // PAGINATION
  // --------------------------
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => setCurrentPage(page);

  // --------------------------
  // ADD / UPDATE SUBMIT
  // --------------------------
  const handleFormSubmit = async (articleData) => {
    setServerError(null);
    const form = new FormData();
    form.append("title", articleData.title);
    form.append("slug", articleData.slug);
    form.append("content", articleData.content);
    form.append("author", articleData.author);
    form.append("date", articleData.date);

    form.append("trending", articleData.trending);

    form.append("tags", JSON.stringify(articleData.tags || []));

    if (articleData.imageFile) {
      form.append("image", articleData.imageFile);
    }

    try {
      if (view === "add") {
        await addMoreNews(baseURL,form);
      } else {
        await updateMoreNews(baseURL,articleData.id, form);
      }

      await loadData();
      setView("list");
      setEditingArticle(null);
    } catch (err) {
      setServerError(err.message || "An error occurred. Please try again.");
    }
  };

  // --------------------------
  // DELETE
  // --------------------------
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteMoreNews(baseURL,itemToDelete.id);
      await loadData();
    } catch (err) {
      console.error("Failed to delete item");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleEdit = (item) => {
    setServerError(null);
    setEditingArticle(item);
    setView("edit");
  };

  const handleAddNew = () => {
    setServerError(null);
    setView("add");
  };
  const handleCancel = () => {
    setServerError(null);
    setView("list");
    setEditingArticle(null);
  };

  // --------------------------
  // TABLE COLUMNS
  // --------------------------
  const columns = [
    {
      header: "Sl. No.",
      cell: (_, index) => <span>{indexOfFirstItem + index + 1}</span>,
    },
    {
      header: "Image",
      type: "image",
      accessor: "imageUrl",
      altAccessor: "title",
    },
    {
      header: "Title",
      accessor: "title",
      cellClassName: "font-medium text-gray-900 max-w-sm truncate",
    },

    {
      header: "Date",
      accessor: "publishedDate",
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
            onClick={() => handleDeleteClick(row)}
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
      <ConfirmationPopup
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete?`}
        isConfirming={isDeleting}
      />
      {/* LIST VIEW */}
      {view === "list" && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">More News</h1>
              <p className="text-gray-700 mt-1 text-sm md:text-base">
                Manage all additional news articles and updates.
              </p>
            </div>

            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-brand-red text-white font-semibold px-4 py-2 rounded-lg transition-all w-full md:w-auto justify-center cursor-pointer"
            >
              <Plus size={20} />
              Add News...
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex items-center gap-3 text-gray-500">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-lg font-medium">Loading News...</span>
              </div>
            </div>
          ) : (
            <>
              <DynamicTable columns={columns} data={currentItems} />
              {list.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </>
      )}

      {/* ADD VIEW */}
      {view === "add" && (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-brand-red hover:text-white cursor-pointer transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Add More News</h1>
              <p className="text-gray-700 mt-1 text-sm md:text-base">
                Add a new article to the More News section.
              </p>
            </div>
          </div>

          <AddArticle
            heading="Create More News"
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            buttonText="Add More News"
            serverError={serverError}
          />
        </div>
      )}

      {/* EDIT VIEW */}
      {view === "edit" && (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-brand-red hover:text-white cursor-pointer transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Edit More News</h1>
              <p className="text-gray-700 mt-1 text-sm md:text-base">
                Edit and update the selected More News article.
              </p>
            </div>
          </div>

          <AddArticle
            heading="Update More News"
            initialData={editingArticle}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            buttonText="Update More News"
            serverError={serverError}
          />
        </div>
      )}
    </div>
  );
}

export default AdminMoreNewsPage;
