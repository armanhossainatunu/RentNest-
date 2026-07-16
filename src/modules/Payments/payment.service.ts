import { Property, User } from "../../../generated/prisma/client";
import { config } from "../../config";
import axios from "axios";

const initializePayment = async (
  property: Property,
  user: User,
  transactionId?: string
) => {
  const finalTransactionId = transactionId || `TRNX_ID_${Date.now()}`;

  const form = new URLSearchParams();
  form.append("store_id", String(config.ssl_commerz_store_id ?? ""));
  form.append("store_passwd", String(config.ssl_commerz_store_password ?? ""));
  form.append("total_amount", String(property.price));
  form.append("currency", "BDT");
  form.append("tran_id", finalTransactionId);

  const baseAppUrl = config.app_url
    ? String(config.app_url).replace(/\/$/, "")
    : "";
  form.append("success_url", `${baseAppUrl}/api/payments/confirm`);
  form.append("fail_url", `${baseAppUrl}/api/payments/confirm`);
  form.append("cancel_url", `${baseAppUrl}/api/payments/confirm`);

  form.append("cus_name", user?.name ?? "Guest");
  form.append("cus_email", user?.email ?? "guest@example.com");
  form.append("cus_add1", "N/A");
  form.append("cus_add2", "N/A");
  form.append("cus_city", "N/A");
  form.append("cus_state", "N/A");
  form.append("cus_postcode", "1000");
  form.append("cus_country", "Bangladesh");
  form.append("cus_phone", user?.email ?? "01700000000");

  const response = await axios.post(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    form.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const data = response.data;
  
  return data;
};

export const paymentService = {
  initializePayment,
};
