import React from 'react';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

interface DialogTitleProps {
    children: React.ReactNode;
    className?: string;
}

interface DialogDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

interface DialogPanelProps {
    children: React.ReactNode;
    className?: string;
}

export function Dialog({ open, onClose, children, className = "" }: DialogProps) {
    if (!open) return null;

    return (
        <div className="relative z-50">
            <div
                className="fixed inset-0 bg-black/30"
                aria-hidden="true"
                onClick={onClose}
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    );
}

Dialog.Title = function DialogTitle({ children, className = "" }: DialogTitleProps) {
    return <h3 className={`text-lg font-medium text-gray-900 ${className}`}>{children}</h3>;
};

Dialog.Description = function DialogDescription({ children, className = "" }: DialogDescriptionProps) {
    return <div className={`mt-2 text-sm text-gray-500 ${className}`}>{children}</div>;
};

Dialog.Panel = function DialogPanel({ children, className = "" }: DialogPanelProps) {
    return <div className={`mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl ${className}`}>{children}</div>;
};
