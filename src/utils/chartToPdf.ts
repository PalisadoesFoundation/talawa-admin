import React from 'react';
import Button from '@mui/material/Button';
import html2canvas from 'html2canvas';
import { generate } from '@pdfme/generator';

export const exportToPDF = async (elementId: string, fileName: string) => {
  const pdfContentElement = document.getElementById(elementId);
  if (pdfContentElement) {
    const canvas = await html2canvas(pdfContentElement);
    const imgData = canvas.toDataURL('image/png');

    // Define the PDF template
    const template = {
      basePdf: null,
      schemas: [
        {
          text: {
            x: 50,
            y: 50,
            width: 500,
            height: 50,
            fontSize: 20,
            text: 'Attendance Statistics',
          },
          image: {
            x: 50,
            y: 100,
            width: 600,
            height: 400,
            image: imgData,
          },
        },
      ],
    };

    // Define the inputs for the PDF
    const inputs = [{}];

    // Generate the PDF
    const pdfBytes = await generate({ template, inputs });
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;
    link.click();
  }
};

export const exportToCSV = (data, filename) => {
  const csvContent =
    'data:text/csv;charset=utf-8,' + data.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export const exportTrendsToCSV = () => {
  const headers = [
    'Date',
    'Attendee Count',
    'Male Attendees',
    'Female Attendees',
    'Other Attendees',
  ];
  const data = [
    headers,
    ...eventLabels.map((label, index) => [
      label,
      attendeeCounts[index],
      maleCounts[index],
      femaleCounts[index],
      otherCounts[index],
    ]),
  ];
  exportToCSV(data, 'attendance_trends.csv');
};

export const exportDemographicsToCSV = () => {
  const headers = [selectedCategory, 'Count'];
  const data = [
    headers,
    ...categoryLabels.map((label, index) => [label, categoryData[index]]),
  ];
  exportToCSV(data, `${selectedCategory.toLowerCase()}_demographics.csv`);
};
