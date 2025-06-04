console.log("Chart script loaded");

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/api/pois");
  const pois = await res.json();
  console.log("POIs data:", pois);

  const counts = {};
  pois.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  const labels = Object.keys(counts);
  const values = Object.values(counts);

  console.log("window.frappe:", window.frappe);
  console.log("Chart function exists:", typeof window.frappe?.Chart);

  // Chart rendering
  const chartContainer = document.getElementById("chart");
  const chart = new window.frappe.Chart(chartContainer, {
    data: {
      labels,
      datasets: [{ name: "POIs", values }],
    },
    type: "pie", // or "percentage"
    height: 300,

    tooltipOptions: {
      formatTooltipY: (value) => `${value}%`,
    },
  });
  console.log("Chart created:", chart);

  // Replace tooltip content to show only percentage
  chart.svg.addEventListener("mousemove", () => {
    const tooltip = document.querySelector(".graph-svg-tip");
    if (tooltip) {
      const valueText = tooltip.querySelector(".value-text");
      const titleText = tooltip.querySelector(".title-text");

      if (valueText && titleText) {
        const rawValue = parseFloat(valueText.textContent);
        const total = values.reduce((a, b) => a + b, 0);
        const percent = ((rawValue / total) * 100).toFixed(1);

        valueText.textContent = `${percent}%`;
        titleText.textContent = ""; // Remove the label (optional)
      }
    }
  });

  // Debugging
  console.log("Frappe Charts Object:", window.frappe);
  console.log("Labels:", labels, "Values:", values);
  console.log("Chart created:", chart);
});
