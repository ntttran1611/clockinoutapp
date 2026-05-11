import { LoadingSpinner } from "./LoadingSpinner.jsx";
export function Table({
  itemList,
  headers,
  isZebra = false,
  children,
  isFetching,
}) {
  return (
    <div className="max-h-[300px] overflow-y-auto overflow-x-auto no-scrollbar transition-all duration-500 ease-in-out w-full">
      <table
        className={`table ${isZebra ? "table-zebra" : ""} font-vietnam text-xs text-text-primary table-pin-rows my-5`}
      >
        <thead className="sticky top-0 bg-white text-almond">
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
