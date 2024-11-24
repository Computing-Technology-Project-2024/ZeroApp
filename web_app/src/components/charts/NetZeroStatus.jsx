import React, { useEffect, useState } from 'react';
import ReactSpeedometer from "react-d3-speedometer";

export default function Speedometer() {
  const [gridImport, setGridImport] = useState(0);
  const [solarExport, setSolarExport] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data from text files...");

        const [importResponse, exportResponse] = await Promise.all([
          fetch(`${process.env.PUBLIC_URL}/Grid_Import.txt`),
          fetch(`${process.env.PUBLIC_URL}/Solar_Export.txt`),
        ]);

        if (!importResponse.ok || !exportResponse.ok) {
          throw new Error('Failed to fetch data from text files');
        }

        const [importData, exportData] = await Promise.all([
          importResponse.json(),
          exportResponse.json(),
        ]);

        console.log("Grid Import Data:", importData);
        console.log("Solar Export Data:", exportData);

        // Process Grid Import Data
        const gridIntervals = importData.intervals.flat(); // Flatten nested intervals if needed
        console.log("Flattened Grid Import Intervals:", gridIntervals);

        const totalGridImport = gridIntervals.reduce(
          (sum, interval) => sum + (interval.wh_imported || 0), // Handle missing `wh_imported` field gracefully
          0
        ) / 1000; // Convert to kWh
        console.log("Total Grid Import (kWh):", totalGridImport);

        // Process Solar Export Data (flatten nested arrays first)
        const flattenedExportIntervals = exportData.intervals.flat();
        console.log("Flattened Solar Export Intervals:", flattenedExportIntervals);

        const totalSolarExport = flattenedExportIntervals.reduce(
          (sum, interval) => sum + (interval.wh_exported || 0), // Handle missing `wh_exported` field gracefully
          0
        ) / 1000; // Convert to kWh
        console.log("Total Solar Export (kWh):", totalSolarExport);

        setGridImport(totalGridImport);
        setSolarExport(totalSolarExport);
      } catch (err) {
        console.error("Error during data fetching and processing:", err);
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate Net Zero value
  const netzerovalue = gridImport > 0 ? (solarExport / gridImport) * 100 : 0;
  const displayValue = Math.min(Math.round(netzerovalue, 0), 200);

  console.log("Net Zero Value (raw):", netzerovalue);
  console.log("Display Value (clamped):", displayValue);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <ReactSpeedometer
        value={displayValue} // Net Zero percentage
        minValue={0}
        maxValue={200} // Over-export shows as "above 100"
        segments={5}
        segmentColors={['#ff4e4e', '#ff8a4e', '#f5d84e', '#a2f54e', '#5ec24e']}
        needleColor="#000"
        ringWidth={30}
        textColor="#000"
        width={300}
        height={200}
      />
      <p>
        {displayValue >= 100
          ? `Over-exporting by ${Math.round(displayValue - 100)}%`
          : `Net Zero at ${Math.round(displayValue)}%`}
      </p>
    </div>
  );
}
