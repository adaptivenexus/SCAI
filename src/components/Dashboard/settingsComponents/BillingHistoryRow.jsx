import { useAuth } from "@/context/AuthContext";
import { formatDate2 } from "@/utils";
import { FaDownload } from "react-icons/fa";

const BillingHistoryRow = ({ item }) => {
  const { subscriptions } = useAuth();
  const subscription = subscriptions.find((sub) => sub.id === item.plan);

  return (
    <tr key={item.id}>
      <td className="py-3 text-center">{formatDate2(item.subscribed_on)}</td>
      <td className="py-3 text-center">{subscription?.name}</td>
      <td className="py-3 text-center">${subscription?.price}</td>
      <td className="py-3 text-center">Visa ending in 1234</td>
      <td className="py-3 text-center">
        {item.is_active ? "Active" : "Inactive"}
      </td>
      <td className="py-3 text-center">
        <button type="button" className="text-primary">
          <FaDownload />
        </button>
      </td>
    </tr>
  );
};
export default BillingHistoryRow;
