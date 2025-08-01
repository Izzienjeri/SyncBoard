import { faker } from '@faker-js/faker';
import { User } from '@/types/api.types';

export interface Student extends User {
  grade: string;
}

export interface Teacher extends User {
  subject: string;
}

const allSubjects = [
    'Mathematics', 'Physics', 'History', 'English', 'Computer Science', 
    'Biology', 'Chemistry', 'Art History', 'Philosophy', 'Economics'
];

export const createRandomStudent = (): Student => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
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