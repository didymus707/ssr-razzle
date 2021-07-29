import { PropertySchema } from '../property'

export const defaultProperties = [
  {
    id: 1,
    name: 'name',
    type: 'TEXT',
    label: 'Name',
    hidden: false
  },
  {
    id: 2,
    name: 'email',
    type: 'EMAIL',
    hidden: false,
    label: 'Email Address'
  },
  {
    id: 3,
    name: 'phone',
    hidden: false,
    type: 'PHONE NUMBER',
    label: 'Phone Number'
  }
] as PropertySchema[]
