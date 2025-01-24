import { InventoryItem, SortDirection } from "../types";
import clsx from "clsx";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { memo } from "react";

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  sortDirection: SortDirection;
  onSort: () => void;
}

const InventoryTable = ({
  items,
  onEdit,
  onDelete,
  sortDirection,
  onSort,
}: InventoryTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className={`table-heading-style`}>Name</th>
            <th className={`table-heading-style`}>Category</th>
            <th
              className={`${`table-heading-style`} cursor-pointer hover:bg-gray-200`}
              onClick={onSort}
            >
              Quantity {sortDirection === "asc" ? "↑" : "↓"}
            </th>
            <th className={`table-heading-style`}>Price</th>
            <th className={`table-heading-style !text-center`}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.length == 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-3 text-gray-500">
                No item found. Please add item.{" "}
              </td>
            </tr>
          ) : (
            <></>
          )}
          {items.map((item) => (
            <tr
              key={item.id}
              className={clsx(
                "hover:bg-gray-50",
                item.quantity < 10 && "bg-red-50"
              )}
            >
              <td className={`table-cell-style font-medium`}>{item.name}</td>
              <td className={`table-cell-style`}>{item.category}</td>
              <td className={`table-cell-style`}>{item.quantity}</td>
              <td className={`table-cell-style`}>${item.price.toFixed(2)}</td>
              <td className={`table-cell-style text-center`}>
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:bg-blue-200 mr-2 bg-blue-50 rounded-md p-1"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className=" text-red-600 hover:bg-red-200 mr-2 bg-red-50 rounded-md p-1"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(InventoryTable);
