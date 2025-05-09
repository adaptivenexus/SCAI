export const handleCheckout = async (plan, isNewRegistration = false) => {
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan, isNewRegistration }),
    });

    const { url } = await response.json();
    window.location.href = url;
    console.log(url);
  } catch (error) {
    console.error("Error:", error);
  }
};
