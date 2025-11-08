import React from 'react';

interface ChartSegment {
    label: string;
    value: number;
    color: string;
}

interface DoughnutChartProps {
    data: ChartSegment[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = 55;
    const circumference = 2 * Math.PI * radius;
    
    if (total === 0) {
        return (
            <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 130 130">
                    <circle r={radius} cx="65" cy="65" fill="transparent" className="stroke-card-secondary" strokeWidth="12" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-text-main">0</span>
                    <span className="text-xs text-text-secondary">Solved</span>
                </div>
            </div>
        );
    }

    let cumulative = 0;

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
                 <circle r={radius} cx="65" cy="65" fill="transparent" className="stroke-card-secondary" strokeWidth="12" />
                {data.map((item, index) => {
                    if (item.value === 0) return null;
                    const dashArray = (item.value / total) * circumference;
                    const dashOffset = (cumulative / total) * circumference;
                    cumulative += item.value;

                    return (
                        <circle
                            key={index}
                            r={radius}
                            cx="65"
                            cy="65"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="12"
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={-dashOffset}
                            className="transition-all duration-500 ease-out"
                            style={{ transitionProperty: 'stroke-dashoffset' }}
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-text-main">{total}</span>
                <span className="text-xs text-text-secondary">Solved</span>
            </div>
        </div>
    );
};

export default DoughnutChart;
