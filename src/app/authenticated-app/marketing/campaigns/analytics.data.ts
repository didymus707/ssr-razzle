export const managerQuarterData = [
  500,
  390,
  670,
  600,
  780,
  440,
  600,
  680,
  550,
  475,
  700,
  795,
];
export const nationalAverageQuarterData = [
  600,
  400,
  600,
  550,
  700,
  500,
  600,
  700,
  500,
  550,
  600,
  700,
];
export const yearLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      type: "bar",
      label: "Proven Oil Reserves (bn)",
      data: managerQuarterData,
      fill: false,
      borderColor: "#ff6c40",
      backgroundColor: "#ff6c40",
      pointBorderColor: "#ff6c40",
      pointBackgroundColor: "#ff6c40",
      pointHoverBackgroundColor: "#ff6c40",
      pointHoverBorderColor: "#ff6c40",
    },
    {
      type: "bar",
      label: "Modified",
      data: nationalAverageQuarterData,
      fill: false,
      backgroundColor: "#ffe700",
      borderColor: "#ffe700",
      hoverBackgroundColor: "#ffe700",
      hoverBorderColor: "#ffe700",
    },
  ],
};

export const mockStatsAPI = [
  {
    id: "8007ff4a887911eaa9519a88eb4ca9b7",
    createdAt: "2020-04-27T11:23:20",
    data: {
      smsSent: 300,
      smsUnsent: 500,
      linkOpenRate: 200,
      conversion: 200,
      totalVisitors: 4000,
      locations: [
        {
          country: "Nigeria",
          totalClicks: 3,
        },
        {
          country: "Spain",
          totalClicks: 1,
        },
        {
          country: "United Kingdom",
          totalClicks: 3,
        },
        {
          country: "United States of America",
          totalClicks: 10,
        },
      ],
    },
  },
  {
    id: "8007ff4a887911eaa9519a88eb4ca9b7",
    createdAt: "2020-04-29T11:23:20",
    data: {
      smsSent: 100,
      smsUnsent: 500,
      linkOpenRate: 150,
      conversion: 270,
      totalVisitors: 200,
      locations: [
        {
          country: "Nigeria",
          totalClicks: 3,
        },
        {
          country: "Spain",
          totalClicks: 1,
        },
        {
          country: "United Kingdom",
          totalClicks: 3,
        },
        {
          country: "United States of America",
          totalClicks: 10,
        },
      ],
    },
  },
];


export function getStats() {
  return new Promise((resolve) => {
    // simulate a fetch call
    setTimeout(() => {
      resolve(mockStatsAPI);
    }, 1000);
  });
}

// Conversion rate = (conversions / total visitors) * 100%
