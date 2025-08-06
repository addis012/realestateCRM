import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Chart: any;
  }
}

export default function LeadSourceChart() {
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
      type: 'doughnut',
      data: {
        labels: ['Website', 'Referrals', 'Social Media', 'Cold Calls', 'Walk-ins'],
        datasets: [{
          data: [35, 25, 20, 12, 8],
          backgroundColor: [
            'hsl(207, 90%, 54%)',
            'hsl(142, 71%, 45%)',
            'hsl(26, 90%, 50%)',
            'hsl(0, 73%, 57%)',
            'hsl(215, 20%, 65%)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20
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
