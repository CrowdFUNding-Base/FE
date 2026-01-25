import { cn } from '@/utils/helpers/cn';

const Container = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <section
            className={cn(
                `mx-auto flex w-full max-w-lg flex-col gap-6 px-8 py-6`,
                className,
            )}
        >
            {children}
        </section>
    );
};

export default Container;