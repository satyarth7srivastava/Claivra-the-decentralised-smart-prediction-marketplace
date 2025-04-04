import Link from "next/link";

export default function SellerDashboard() {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Seller Dashboard</h1>
                <p className="text-lg text-gray-600 mb-8">Welcome to your dashboard!</p>
                <div className="flex gap-6">
                    <Link href="/organizer-dashboard/create-new-quiz" legacyBehavior>
                        <a className="bg-primaryBlue text-primaryWhite py-3 px-6 rounded-md hover:bg-blue-700 transition-all">
                            Create New Quiz
                        </a>
                    </Link>
                    <Link href="/organizer-dashboard/your-quizes" legacyBehavior>
                        <a className="bg-primaryBlue text-primaryWhite py-3 px-6 rounded-md hover:bg-blue-700 transition-all">
                            Your Quizzes
                        </a>
                    </Link>
                </div>
            </div>
        </>
    );
}