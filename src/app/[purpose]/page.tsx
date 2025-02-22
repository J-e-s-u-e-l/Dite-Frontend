import VerificationComponent from "./VerificationComponent";

interface AuthPageProps {
  params: { purpose: string };
}

const AuthPage = ({ params }: AuthPageProps) => {
  const { purpose } = params;

  // Validate `purpose`
  if (purpose !== "emailVerification" && purpose !== "passwordReset") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 text-center bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600">Invalid Purpose</h2>
          <p className="mt-2 text-gray-700">
            Please check the URL or contact support.
          </p>
        </div>
      </div>
    );
  }

  // if (purpose !== "emailVerification" && purpose !== "passwordReset") {
  //   return (notFound);
  // }

  return (
    <VerificationComponent
      purpose={purpose as "emailVerification" | "passwordReset"}
    />
  );
};

export default AuthPage;
