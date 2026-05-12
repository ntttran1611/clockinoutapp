import { LoadingSpinner } from "./LoadingSpinner.jsx";
import { useEffect, useRef } from "react";

export function Table({
  itemList,
  headers,
  isZebra = false,
  children,
  isFetching,
}) {
  return (
    <div className="absolute inset-0 overflow-x-auto no-scrollbar">
      <table
        className={`table ${isZebra ? "table-zebra" : ""} font-vietnam text-xs text-text-primary table-pin-rows`}
      >
        <thead className="text-almond">
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        {isFetching ? (
          <tbody>
            <tr>
              <td colSpan={headers.length} className="text-center py-8">
                <LoadingSpinner />
              </td>
            </tr>
          </tbody>
        ) : itemList && itemList.length > 0 ? (
          <tbody>{children}</tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={headers.length} className="text-center">
                No data found
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
