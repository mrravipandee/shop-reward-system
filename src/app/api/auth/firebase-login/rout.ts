const handleOtpSuccess = async (phone: string) => {
  const res = await fetch("/api/auth/firebase-login", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });

  const data = await res.json();
  console.log(data.user);
};
