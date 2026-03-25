import { Skeleton } from "../ui/skeleton";

export default function LoadingSkeleton() {
    return (
        <div className="w-full max-w-5xl space-y-4 px-4 py-12 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
                <Skeleton className="w-[150px] h-[40px] rounded-full" />
            </div>

            {/* Subtitle */}
            <Skeleton className="w-[180px] h-[20px] rounded-full mb-6" />

            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 py-3 px-4">
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
            </div>

            {/* Table Rows */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-4 gap-4 py-4 px-4">
                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                    <Skeleton className="w-[200px] h-[20px] rounded-full" />
                    <Skeleton className="w-[40px] h-[20px] rounded-full" />
                </div>
            ))}
        </div>
    );
}
