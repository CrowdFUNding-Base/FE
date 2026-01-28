import Container from '@/components/layout/container';
import { cn } from '@/utils/helpers/cn';

interface GradientProps {
    className?: string;
}

const Gradient = ({ className }: GradientProps) => {
    return (
        <div className={cn("absolute bg-[#EDEDED] w-full top-0 h-screen overflow-clip", className)}>
            <div className="absolute w-108 h-107 bottom-0 -left-50 bg-cyan-100 rounded-full blur-[90px]" />
            <div className="absolute w-108 h-107 top-24 -right-40 bg-yellow-100 rounded-full blur-[80px]" />
            <div className="absolute w-108 h-132 -bottom-36 -right-28 bg-blue-100 rounded-full blur-[90px]" />
        </div>
    );
};

export default Gradient;