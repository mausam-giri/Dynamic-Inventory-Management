import { useCallback, useMemo, useState } from "react";
import { InventoryItem, SortDirection } from "./types";
import InventoryTable from "./components/InventoryTable";
import { ItemForm } from "./components/ItemForm";
import { initialItems } from "./mock-data";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

function App() {
  const {
    storedValue: items,
    setValue,
    clearValue,
    setInitialValue,
  } = useLocalStorage("inventory-management", initialItems);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))),
    [items]
  );

  const filterItem = (
    items: InventoryItem[],
    selectedCategory: string,
    sortDirection: string
  ) => {
    return items
      .filter((item) => !selectedCategory || item.category === selectedCategory)
      .sort((a, b) => {
        const modifier = sortDirection === "asc" ? 1 : -1;
        return (a.quantity - b.quantity) * modifier;
      });
  };

  const filteredItems = useMemo(
    () => filterItem(items, selectedCategory, sortDirection),
    [items, selectedCategory, sortDirection]
  );

  const handleAddItem = (newItem: Omit<InventoryItem, "id">) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
    };
    console.log(items);
    setValue([...items, item]);
    setIsFormOpen(false);
  };

  const handleEditItem = useCallback(
    (updatedItem: Omit<InventoryItem, "id">) => {
      if (!editingItem) return;

      setValue(
        items.map((item) =>
          item.id === editingItem.id ? { ...updatedItem, id: item.id } : item
        )
      );
      setEditingItem(undefined);
    },
    [editingItem]
  );

  const handleDeleteItem = useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setValue(items.filter((item) => item.id !== id));
    }
  }, []);

  const toggleSort = useCallback(() => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Inventory Management
            </h1>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add New Item
            </button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Filter by Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 block min-w-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <InventoryTable
            items={filteredItems}
            onEdit={setEditingItem}
            onDelete={handleDeleteItem}
            sortDirection={sortDirection}
            onSort={toggleSort}
          />

          {(isFormOpen || editingItem) && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                  {editingItem ? "Edit Item" : "Add New Item"}
                </h2>
                <ItemForm
                  item={editingItem}
                  onSubmit={editingItem ? handleEditItem : handleAddItem}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setEditingItem(undefined);
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-end items-center gap-2">
          <button className="btn btn-danger" onClick={setInitialValue}>
            Reset to default
          </button>
          <button className="btn btn-danger" onClick={clearValue}>
            Remove all records
          </button>
        </div>
        <p className="bg-yellow-200 text-center py-1 mt-2 rounded">
          I have used some mock data to display for initial page load
        </p>
      </div>
      <div className="fixed w-full bottom-0 bg-white">
        <div className="max-w-7xl mx-auto ">
          <div className="flex items-center justify-between gap-3 px-3 py-2">
            <h2 className="text-gray-600">
              Designed by <strong>Mausam Giri</strong>
            </h2>
            <div className="flex gap-3 items-center">
              <a
                href="https://mausamgiri.vercel.app"
                className="flex gap-2 items-center text-blue-700 font-medium"
              >
                <span>Portfolio</span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/mausam-giri"
                className="flex gap-2 items-center text-blue-700 font-medium"
              >
                <span>Github</span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/in/mausamgiri"
                className="flex gap-2 items-center text-blue-700 font-medium"
              >
                <span>Linkedin</span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
