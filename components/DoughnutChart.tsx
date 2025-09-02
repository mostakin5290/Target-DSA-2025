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
    if (total === 0) {
        return (
            <div className="relative w-56 h-56">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle r="80" cx="100" cy="100" fill="transparent" stroke="rgba(38, 38, 38, 0.5)" strokeWidth="20" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-light">0</span>
                    <span className="text-sm text-dark-text">Solved</span>
                </div>
            </div>
        );
    }

    let cumulative = 0;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="relative w-56 h-56">
            <svg className="w-full h-full" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                 <circle r={radius} cx="100" cy="100" fill="transparent" stroke="rgba(38, 38, 38, 0.5)" strokeWidth="20" />
                {data.map((item, index) => {
                    if (item.value === 0) return null;
                    const dashArray = (item.value / total) * circumference;
                    const dashOffset = (cumulative / total) * circumference;
                    cumulative += item.value;

                    return (
                        <circle
                            key={index}
                            r={radius}
                            cx="100"
                            cy="100"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="20"
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={-dashOffset}
                            className="transition-all duration-500 ease-out"
                            style={{ transitionProperty: 'stroke-dashoffset' }}
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-light">{total}</span>
                <span className="text-sm text-dark-text">Solved</span>
            </div>
        </div>
    );
};

export default DoughnutChart;
