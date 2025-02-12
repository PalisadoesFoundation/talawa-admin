export const EducationGrade = {
  GRADE_1: 'GRADE_1',
  GRADE_2: 'GRADE_2',
  GRADE_3: 'GRADE_3',
  GRADE_4: 'GRADE_4',
  GRADE_5: 'GRADE_5',
  GRADE_6: 'GRADE_6',
  GRADE_7: 'GRADE_7',
  GRADE_8: 'GRADE_8',
  GRADE_9: 'GRADE_9',
  GRADE_10: 'GRADE_10',
  GRADE_11: 'GRADE_11',
  GRADE_12: 'GRADE_12',
  GRADUATE: 'GRADUATE',
  KG: 'KG',
  NO_GRADE: 'NO_GRADE',
  PRE_KG: 'PRE_KG',
} as const;
export type EducationGrade =
  (typeof EducationGrade)[keyof typeof EducationGrade];

export const EmploymentStatus = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  UNEMPLOYED: 'UNEMPLOYED',
} as const;

export type EmploymentStatus =
  (typeof EmploymentStatus)[keyof typeof EmploymentStatus];
