export const handleCheckout = async (planType) => {
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planType }),
    });

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error("Error:", error);
  }
};
