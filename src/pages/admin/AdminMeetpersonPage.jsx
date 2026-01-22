import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ChevronLeft, Loader2 } from "lucide-react";
import Pagination from "../../components/admin/Pagination";
import DynamicTable from "../../components/admin/DynamicTable";
import ConfirmationPopup from "../../components/admin/ConfirmationPopup";
import AddArticle from "../../components/admin/AddArticle";

import {
  fetchMeetPersons,
  addMeetPerson,
  updateMeetPerson,
  deleteMeetPerson,
} from "../../services/meetPersonService";
import { useApi } from "../../context/ApiContext";

function AdminMeetpersonPage() {
  const { baseURL } = useApi();

  const [list, setList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("list"); // list | add | edit
  const [editingArticle, setEditingArticle] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const ITEMS_PER_PAGE = 10;

  // ------------------------------------
  // LOAD DATA
  // ------------------------------------
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMeetPersons(baseURL);

      const sortedData = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );

      const formatted = sortedData.map((item) => ({
        ...item,
        imageUrl: item.image
          ? `${baseURL}/${item.image.replace(/\\/g, "/")}`
          : "/placeholder.jpg",
        publishedDate: item.date.split("T")[0],
        trending: item.trending ?? false,
      }));

      setList(formatted);
    } catch (err) {
      console.error("Error loading Meet The Person");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredList = list.filter((item) =>
    String(item.slug || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentList = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => setCurrentPage(page);

  // ------------------------------------
  // ADD OR UPDATE FORM SUBMIT
  // ------------------------------------
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
        await addMeetPerson(baseURL, form);
      } else {
        await updateMeetPerson(baseURL, articleData.id, form);
      }

      await loadData();
      setView("list");
      setEditingArticle(null);
    } catch (err) {
      setServerError(err.message || "An error occurred. Please try again.");
    }
  };

  // ------------------------------------
  // DELETE
  // ------------------------------------
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteMeetPerson(baseURL, itemToDelete.id);
      await loadData();
    } catch (err) {
      console.error("Failed to delete item");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  // ------------------------------------
  // EDIT
  // ------------------------------------
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

  // ------------------------------------
  // TABLE COLUMNS
  // ------------------------------------
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
      header: "SLUG",
      accessor: "slug",
      cellClassName: "font-medium text-gray-900 max-w-xs truncate",
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
              <h1 className="text-2xl md:text-3xl font-bold">
                Meet The Person
              </h1>
              <p className="text-gray-700 mt-1 text-sm md:text-base">
                Manage exclusive interviews and profiles.
              </p>
            </div>

            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-brand-red text-white font-semibold px-4 py-2 rounded-lg transition-all w-full md:w-auto justify-center cursor-pointer"
            >
              <Plus size={20} />
              Add Meet The Person
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex items-center gap-3 text-gray-500">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-lg font-medium">Loading News...</span>
              </div>
            </div>
          ) : (
            <>
              <DynamicTable
                columns={columns}
                data={currentList}
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
              />

              {filteredList.length > 0 && (
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
              <h1 className="text-2xl md:text-3xl font-bold">
                Add Meet The Person
              </h1>
              <p className="text-gray-700 mt-1 text-sm md:text-base">
                Fill in the details to create a new interview.
              </p>
            </div>
          </div>

          <AddArticle
            heading="Create Meet The Person"
            onSubmit={handleFormSubmit}
            buttonText="Add Person"
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
              <h1 className="text-2xl md:text-3xl font-bold">
                Edit Meet The Person
              </h1>
              <p className="text-gray-700 mt-1 text-sm md:text-base">
                Update the interview details.
              </p>
            </div>
          </div>

          <AddArticle
            heading="Update Meet The Person"
            initialData={editingArticle}
            onSubmit={handleFormSubmit}
            buttonText="Update Person"
            serverError={serverError}
          />
        </div>
      )}
    </div>
  );
}

export default AdminMeetpersonPage;
