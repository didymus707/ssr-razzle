import { PropertyTypeConjuctionDic } from './filter.types'
import format from 'date-fns/format'
import endOfToday from 'date-fns/endOfToday'
import endOfTomorrow from 'date-fns/endOfTomorrow'
import endOfYesterday from 'date-fns/endOfYesterday'
import addWeeks from 'date-fns/addWeeks'
import subWeeks from 'date-fns/subWeeks'
import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'
import addYears from 'date-fns/addYears'
import subYears from 'date-fns/subYears'

export const FILTER_CONJUCTIONS = [
  { label: 'And', value: 'and' },
  { label: 'Or', value: 'or' }
]

export const TEXT_FIELD_FILTERS = [
  { label: 'is', value: 'equals' },
  { label: 'is not', value: 'notEqual' },
  { label: 'is empty', value: 'empty' },
  { label: 'is not empty', value: 'notEmpty' },
  { label: 'contains', value: 'contains' },
  { label: 'does not contain', value: 'notContain' }
]

export const NUMBER_FIELD_FILTERS = [
  { label: 'equal to', value: 'equals' },
  { label: 'greater than', value: 'greater' },
  { label: 'less than', value: 'less' },
  { label: 'is empty', value: 'empty' },
  { label: 'is not empty', value: 'notEmpty' },
  { label: 'less than or equal to', value: 'lessEq' },
  { label: 'greater than or equal to', value: 'greaterEq' }
]

export const DATE_FIELD_FILTERS = [
  { label: 'is', value: 'dateEqual' },
  { label: 'is within', value: 'dateWithin' },
  { label: 'is before', value: 'dateBefore' },
  { label: 'is after', value: 'dateAfter' },
  { label: 'is on or before', value: 'dateOnBefore' },
  { label: 'is on or after', value: 'dateOnAfter' },
  { label: 'is not', value: 'dateNotEqual' },
  { label: 'is empty', value: 'empty' },
  { label: 'is not empty', value: 'notEmpty' }
]

export const DATE_FIELD_SUB_FILTERS = [
  { label: 'today', value: format(endOfToday(), 'dd-MM-yyyy') },
  { label: 'tomorrow', value: format(endOfTomorrow(), 'dd-MM-yyyy') },
  { label: 'Yesterday', value: format(endOfYesterday(), 'dd-MM-yyyy') },
  {
    label: 'one week ago',
    value: format(subWeeks(new Date(), 1), 'dd-MM-yyyy')
  },
  {
    label: 'one week from now',
    value: format(addWeeks(new Date(), 1), 'dd-MM-yyyy')
  },
  {
    label: 'one month ago',
    value: format(subMonths(new Date(), 1), 'dd-MM-yyyy')
  },
  {
    label: 'one month from now',
    value: format(addMonths(new Date(), 1), 'dd-MM-yyyy')
  },
  {
    label: 'one year ago',
    value: format(subYears(new Date(), 1), 'dd-MM-yyyy')
  },
  {
    label: 'one year from now',
    value: format(addYears(new Date(), 1), 'dd-MM-yyyy')
  },
  { label: 'exact date', value: 'exact date' }
]

export const SELECT_FILED_FILTERS = [
  { label: 'is', value: 'equals' },
  { label: 'is not', value: 'notEquals' },
  { label: 'is any of', value: 'isAnyOf' },
  { label: 'is none of', value: 'isNoneOf' },
  { label: 'is empty', value: 'empty' },
  { label: 'is not empty', value: 'notEmpty' }
]

export const MULTI_SELECT_FILED_FILTERS = [
  { label: 'has any of', value: 'hasAnyOf' },
  { label: 'has all of', value: 'hasAllOf' },
  { label: 'is exactly', value: 'hasExactly' },
  { label: 'has none of', value: 'isNoneOf' },
  { label: 'is empty', value: 'empty' },
  { label: 'is not empty', value: 'notEmpty' }
]

export const MEDIA_FIELD_FILTERS = [
  { label: 'is empty', value: 'empty' },
  { label: 'is not empty', value: 'notEmpty' }
]

export const PROPERTY_TYPE_OPERATORS = {
  url: TEXT_FIELD_FILTERS,
  text: TEXT_FIELD_FILTERS,
  date: DATE_FIELD_FILTERS,
  email: TEXT_FIELD_FILTERS,
  number: NUMBER_FIELD_FILTERS,
  select: SELECT_FILED_FILTERS,
  'phone number': TEXT_FIELD_FILTERS,
  'multi select': MULTI_SELECT_FILED_FILTERS
} as PropertyTypeConjuctionDic
