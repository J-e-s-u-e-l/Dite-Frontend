export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateUsername = async (username: string) => {
  if (username.length < 3) return "Username must be at least 3 characters.";
  if (username.length > 20) return "Username must not exceed 20 characters.";
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Registration/uniqueUsername`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      }
    );

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server responded with an error:", errorData);
      return "Unable to check username availability at the moment. Please try again later.";
    }

    // Parse response
    const available = await response.json();
    return available.status
      ? "Username is unavailable."
      : "Username is available";
  } catch (error) {
    console.error("Network or server error:", error);
    return "A network error occurred. Please check your connection and try again.";
  }

  // try {
  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}/Registration/uniqueUsername`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ username }),
  //     }
  //   );
  //   const available = await response.json();
  //   return available.status
  //     ? "Username is unavailable."
  //     : "Username is available";
  // } catch (error) {
  //   console.error(
  //     error,
  //     "An error occurred while checking username availability."
  //   );
  //   return "An error occurred while checking username availability.";
  // }
};

export const validatePassword = (password: string) => {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  return password === confirmPassword
    ? "Passwords match!"
    : "Passwords do not match.";
};

export const validateUniqueEmail = async (email: string) => {
  if (!validateEmail(email)) return "Invalid email format.";
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Registration/uniqueEmail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    const available = await response.json();
    return available.status ? "Email is already in use." : "Email is available";
  } catch (error) {
    console.error(
      error,
      "An error occurred while checking email availability."
    );
    return "An error occurred while checking email availability.";
  }
};
