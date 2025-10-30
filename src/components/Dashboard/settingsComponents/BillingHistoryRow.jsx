import { useAuth } from "@/context/AuthContext";
import { formatDate2 } from "@/utils";
import { FiDownload, FiCreditCard, FiCalendar, FiDollarSign } from "react-icons/fi";

const BillingHistoryRow = ({ item }) => {
  const { subscriptions } = useAuth();
  const subscription = subscriptions.find((sub) => sub.id === item.plan);

  return (
    <tr className="hover:bg-white/80 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary flex items-center justify-center">
            <FiCalendar className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            {formatDate2(item.subscribed_on)}
          </span>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {subscription?.name || "Unknown Plan"}
          </span>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <FiDollarSign className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-foreground">
            ${subscription?.price || "0.00"}
          </span>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <FiCreditCard className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-secondary-foreground">
            Visa ending in 1234
          </span>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          item.is_active 
            ? "bg-green-100 text-green-700" 
            : "bg-gray-100 text-gray-700"
        }`}>
          {item.is_active ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="py-4 px-6">
        <button 
          type="button" 
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
          title="Download Invoice"
        >
          <FiDownload className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};
export default BillingHistoryRow;
