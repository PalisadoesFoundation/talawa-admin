
import React from 'react'

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const suffixes = ['th', 'st', 'nd', 'rd'];
    const suffix = suffixes[day % 10 > 3 ? 0 : day % 10];

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return `${day}${suffix} ${monthNames[monthIndex]} ${year}`;
  }