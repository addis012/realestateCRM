import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Chart: any;
  }
}

export default function SalesChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || !window.Chart) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Sales ($)',
          data: [120000, 150000, 180000, 165000, 200000, 185000],
          borderColor: 'hsl(207, 90%, 54%)',
          backgroundColor: 'hsla(207, 90%, 54%, 0.1)',
          tension: 0.4,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value: any) {
                return '$' + (value / 1000) + 'K';
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Load Chart.js from CDN
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        // Chart will be created in the effect above
      };
      
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  return <canvas ref={chartRef} className="w-full h-64" />;
}
