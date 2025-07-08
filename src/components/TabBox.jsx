export default function TabBox({ itemList, tab_name }) {
  if (!itemList) throw new Error("Option list required");
  return (
    <div className="tabs tabs-box">
      {itemList.map((item) => {
        return (
          <input
            key={item}
            type="radio"
            name={tab_name}
            className="tab"
            aria-label={item.toString()}
            data-value={item}
          />
        );
      })}
    </div>
  );
}
