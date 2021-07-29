import { PropertySchema, TypeProps } from './property.types'
import { OptionTypeBase } from 'react-select'

export const PROPERTIES_ICONS: OptionTypeBase = {
  'url': 'link',
  'text': 'text',
  'email': 'email',
  'number': 'number',
  'date': 'calendar',
  'select': 'select',
  'person': 'person',
  'phone number': 'phone',
  'multi select': 'multi-select',
}

export const PROPERTIES = [
  {
    icon: 'text',
    label: 'Text',
    tooltip: 'Click to add a text'
  },
  {
    icon: 'number',
    label: 'Number',
    tooltip: 'Click to add a number'
  },
  {
    icon: 'phone',
    label: 'Phone Number',
    tooltip: 'Click to add a phone number'
  },
  {
    icon: 'calendar',
    label: 'Date',
    tooltip: 'Click to add a date'
  },
  {
    icon: 'link',
    label: 'Url',
    tooltip: 'Click to add a link'
  },
  {
    icon: 'email',
    label: 'Email',
    tooltip: 'Click to add a email'
  },
  // {
  //   icon: 'file',
  //   label: 'File & Media',
  //   tooltip: 'Click to add a file'
  // },
  {
    icon: 'select',
    label: 'Select',
    tooltip: 'Click to select an option'
  },
  {
    icon: 'multi-select',
    label: 'Multi Select',
    tooltip: 'Click to multi select different options'
  },
  {
    icon: 'person',
    label: 'Person',
    tooltip: 'Click to add a person'
  }
] as TypeProps[]

export const PropertyList = [
  {
    name: 'First Name',
    type: 'Text',
    label: 'Text',
    hidden: true
  },
  {
    name: 'Last name',
    type: 'Text',
    label: 'Text',
    hidden: true
  },
  {
    name: 'Email Address',
    type: 'Email',
    label: 'Email',
    hidden: true
  },
  {
    name: 'Phone Number',
    type: 'PhoneNumber',
    label: 'Phone Number',
    hidden: true
  }
] as PropertySchema[]
