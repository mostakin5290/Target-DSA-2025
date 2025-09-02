import React from 'react';

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
);

export default Spinner;