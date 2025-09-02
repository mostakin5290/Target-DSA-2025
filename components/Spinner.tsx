import React from 'react';

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="w-16 h-16 border-4 border-accent border-dashed rounded-full animate-spin"></div>
    </div>
);

export default Spinner;
