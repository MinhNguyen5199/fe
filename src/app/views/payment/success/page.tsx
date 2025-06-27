export default function Paymentsuccess(){
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <h1 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h1>
            <p className="text-gray-700 mb-6">Thank you for your purchase. Your transaction has been completed successfully.</p>
            <a href="/dashboard" className="text-blue-600 hover:underline">Go to Dashboard</a>
        </div>
        </div>
    );
}