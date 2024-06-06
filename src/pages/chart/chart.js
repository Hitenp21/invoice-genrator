import React, { useEffect, useRef } from 'react';

const BarChart = ({ data = [], labels = [] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data.length || !labels.length) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const padding = 50; // Padding for axes
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barSpacing = 40; // Spacing between bars
    const barWidth = (chartWidth - barSpacing * (data.length - 1)) / data.length;
    const maxDataValue = Math.max(...data.map(value => parseFloat(value)));

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw y-axis
    context.beginPath();
    context.moveTo(padding, padding);
    context.lineTo(padding, canvas.height - padding);
    context.stroke();

    // Draw x-axis
    context.beginPath();
    context.moveTo(padding, canvas.height - padding);
    context.lineTo(canvas.width - padding, canvas.height - padding);
    context.stroke();

    // Set font size for labels
    context.font = '16px Arial';

    // Draw bars
    data.forEach((value, index) => {
      const barHeight = (parseFloat(value) / maxDataValue) * chartHeight;
      const x = padding + index * (barWidth + barSpacing);
      const y = canvas.height - padding - barHeight;

      context.fillStyle = '#3498db'; // Bar color (blue)
      context.fillRect(x, y, barWidth, barHeight);

      // Draw bar labels
      context.fillStyle = '#000';
      context.textAlign = 'center';
      context.fillText(labels[index], x + barWidth / 2, canvas.height - padding + 20);
    });

    // Draw y-axis labels
    const yAxisLabelCount = 5;
    for (let i = 0; i <= yAxisLabelCount; i++) {
      const value = ((maxDataValue / yAxisLabelCount) * i) / 1e5; // Divide by 1e5 for Lac
      const y = canvas.height - padding - (value / (maxDataValue / 1e5)) * chartHeight; // Adjust for Lac

      context.fillStyle = '#000';
      context.textAlign = 'right';
      context.fillText(`${value} Lac`, padding - 10, y + 5); // Append "Lac" to label

      // Draw grid lines
      context.strokeStyle = '#e0e0e0';
      context.beginPath();
      context.moveTo(padding, y);
      context.lineTo(canvas.width - padding, y);
      context.stroke();
    }
  }, [data, labels]);

  return <canvas ref={canvasRef} width={800} height={500} />;
};

export default BarChart;
