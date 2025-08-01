import { faker } from '@faker-js/faker';

// Base user properties shared by all user types
export interface BaseUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  address: {
    address: string;
    city: string;
    postalCode: string;
    state: string;
  };
}

// Student type with a unique 'type' property and 'grade'
export interface Student extends BaseUser {
  type: 'student';
  grade: string;
}

// Teacher type with a unique 'type' property and 'subject'
export interface Teacher extends BaseUser {
  type: 'teacher';
  subject: string;
}

// The Discriminated Union type
export type AppUser = Student | Teacher;

const allSubjects = [
    'Mathematics', 'Physics', 'History', 'English', 'Computer Science', 
    'Biology', 'Chemistry', 'Art History', 'Philosophy', 'Economics'
];

export const createRandomStudent = (): Student => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    type: 'student', // Add discriminator
    id: faker.number.int({ min: 1, max: 100000 }),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    phone: `(${faker.string.numeric(3)}) ${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
    image: faker.image.avatar(),
    address: {
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      postalCode: faker.location.zipCode(),
      state: faker.location.state({ abbreviated: true }),
    },
    grade: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'F']),
  };
};

export const createRandomTeacher = (): Teacher => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    type: 'teacher', // Add discriminator
    id: faker.number.int({ min: 100001, max: 200000 }),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    phone: `(${faker.string.numeric(3)}) ${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
    image: faker.image.avatar(),
    address: {
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      postalCode: faker.location.zipCode(),
      state: faker.location.state({ abbreviated: true }),
    },
    subject: faker.helpers.arrayElement(allSubjects),
  };
};
