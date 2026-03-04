export const StageCard = ({ number, title, description }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 max-w-md">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                    {number}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    );
};