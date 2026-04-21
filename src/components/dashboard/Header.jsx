import { RiChatSmile3Line } from "react-icons/ri";
export default function Header({ staff }) {
  return (
    <div className="flex flex-col bg-fantasy-50 p-10 w-full justify-between font-vietnam min-h-fit h-1/5 border-t border-b border-almond">
      <h1 className="ml-4 text-light-pink font-medium text-2xl flex gap-1 items-center">
        <RiChatSmile3Line />
        {`G'day, ${staff.firstName}! Ready to clock in?`}
      </h1>
      <p className="ml-4 text-text-primary font-light">
        ID number: {staff.id} | Branch: {localStorage.getItem("branch")}
      </p>
    </div>
  );
}
