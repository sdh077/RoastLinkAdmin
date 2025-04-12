'use client'
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      // position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
};


type TempData = {
  label: string;
  data: number;
}

export function LineGraph({ datas, title }: { title: string; datas: TempData[] }) {
  const labels = datas.map(data => data.label)
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: datas.map(data => data.data),
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
      },
    ],
  };
  return (
    <div className='w-full'>
      <Line options={options} data={data} />
    </div>
  );
}
