// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const VerifyEmailPage = () => {
//   const [email, setEmail] = useState("");
//   const router = useRouter();
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setEmail(localStorage.getItem("userEmail") || "");
//   }, []);

//   const payload = {
//     recipientType: "1",
//     recipient: email,
//     purpose: "1",
//   };

//   const handleVerifyEmail = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/send-verification-code`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await response.json();

//       if (data.status) {
//         alert(data.message);
//         router.push("/verify-otp");
//       } else {
//         setError(data.message);
//       }
//     } catch (error) {
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
//         <h1 className="text-2xl font-bold text-center text-gray-800">
//           Verify Your Email
//         </h1>
//         <div className="mt-4">
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Email
//           </label>
//           <input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400 sm:text-sm"
//             placeholder="Enter your email"
//           />
//         </div>

//         {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

//         <button
//           onClick={handleVerifyEmail}
//           className="mt-6 w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
//         >
//           Verify Email
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VerifyEmailPage;
