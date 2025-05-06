export const handleCheckout = async (plan) => {
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan }),
    });

    const { url } = await response.json();
    window.location.href = url;
    console.log(url);
  } catch (error) {
    console.error("Error:", error);
  }
};
