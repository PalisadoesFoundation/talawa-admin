// dateTimeConfig.ts

export const dateTimeFields = {
  directFields: [
    'createdAt',
    'birthDate',
    'updatedAt',

    'dueDate',
    'completionDate',
    'startCursor',
    'endCursor',
  ],
  pairedFields: [
    {
      dateField: 'startDate',
      timeField: 'startTime',
      combinedField: 'startDateTime',
    },
    {
      dateField: 'endDate',
      timeField: 'endTime',
      combinedField: 'endDateTime',
    },
  ],
};
