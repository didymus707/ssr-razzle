import { format, utcToZonedTime } from 'date-fns-tz';

export const objectIsEmpty = (obj: object) => {
  if (!Boolean(obj)) {
    return true;
  }
  if (Object.keys(obj).length === 0) {
    return true;
  }
};

export const toFormData = (values: object, files?: File, fileName: string = 'file') => {
  const formData = new FormData();
  if (!objectIsEmpty(values)) {
    const valuesArray = Object.entries(values);
    valuesArray.forEach(value => {
      if (Array.isArray(value[1])) {
        const arrayString = value[1].join(',');
        formData.set(value[0], arrayString);
      } else if (objectIsEmpty(value[1])) {
        const stringValue = JSON.stringify(value[1]);
        formData.set(value[0], stringValue);
      } else {
        formData.set(value[0], value[1]);
      }
    });
  }
  if (files) {
    formData.append(fileName ?? '', files);
  }
  return formData;
};

export function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

export function validateEmail(value: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
}

export const scrollToSection = (id: string) => {
  const element = document.querySelector(`#${id}`);
  if (!element) return;
  element.scrollIntoView();
};

export const isInViewport = (id: string) => {
  const elem = document.querySelector(`#${id}`);
  if (!elem) return false;

  const style = getComputedStyle(elem);
  if (style.display === 'none') return false;
  if (style.visibility !== 'visible') return false;
  if (Number(style.opacity) < 0.01) return false;
  // @ts-ignore
  const { offsetWidth, offsetHeight } = elem;
  if (
    offsetWidth +
      offsetHeight +
      elem.getBoundingClientRect().height +
      elem.getBoundingClientRect().width ===
    0
  ) {
    return false;
  }
  const elemCenter = {
    x: elem.getBoundingClientRect().left + offsetWidth / 2,
    y: elem.getBoundingClientRect().top + offsetHeight / 2,
  };
  if (elemCenter.x < 0) return false;
  if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
  if (elemCenter.y < 0) return false;
  if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
  let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
  if (!pointContainer) return false;
  do {
    if (pointContainer === elem) return true;
    // @ts-ignore
  } while ((pointContainer = pointContainer.parentNode));
  return false;
};

export function getReference() {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=';

  for (let i = 0; i < 15; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function getZonedTime(dateString: string, pattern: string) {
  const date = new Date(dateString);
  const timeZone =
    typeof window.Intl === undefined ? '' : window.Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDate = utcToZonedTime(date, timeZone);
  return format(zonedDate, pattern);
}

export function formatCurrency(amount: Number) {
  const amountNotUndefined = Number(amount) || 0;
  const amountInDecimal = amountNotUndefined.toLocaleString('en-US');
  return amountInDecimal;
}

export const getSubscriptionPlanItemIcon = (service: string) => {
  const services_with_icons: Array<string> = [
    'apps.twitter',
    'apps.messenger',
    'apps.whatsapp',
    'apps.instagram',
    'apps.lists',
    'apps.lists.rows',
    'apps.lists.columns',
    'credits.campaign',
    'credits.social',
  ];
  if (services_with_icons.includes(service)) return `/images/subscription-items/${service}.svg`;
  return '/images/subscription-items/apps.twitter.svg';
};

export const getSubscriptionPlanItemUnit = (service: string) => {
  if (service.includes('credits')) return 'credit';
  if (['apps.twitter', 'apps.messenger', 'apps.whatsapp', 'apps.instagram'].includes(service))
    return 'account';
  if (service === 'apps.lists') return 'list';
  if (service === 'apps.lists.rows') return 'row';
  if (service === 'apps.lists.columns') return 'column';
  return 'unit';
};
export const numberWithCommas = (x: number | undefined) =>
  x
    ? Number.isInteger(x)
      ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '0';

export const formUrlQueryFromObject = (obj: { [k: string]: any }) => {
  const query = new URLSearchParams();
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    value && query.append(key, value);
  });

  return query.toString();
};

export const toNumber = (value: string) => parseFloat(value.replace(/,/g, ''));

export const toThousandString = (text: string) => {
  const numberValue = toNumber(text);
  if (text.includes('.')) {
    const parts = text.split('.');

    if (parts.length > 1) {
      const n = parts[0] ? toNumber(parts[0]) : 0;
      const part0 = new Intl.NumberFormat('en-GB').format(n);
      const part1 = parts[1].toString().substring(0, 2);
      return `${part0}.${part1}`;
    } else {
      return text;
    }
  } else {
    return new Intl.NumberFormat().format(numberValue);
  }
};

export function uploadFile(options: {
  url: string;
  file: File;
  data?: any;
  responseKey?: string;
  onProgress: (percentage: number) => void;
}) {
  const { url, data, file, onProgress, responseKey } = options;

  return new Promise<string>((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    xhr.onload = () => {
      const resp = JSON.parse(xhr.responseText);
      res(resp[responseKey ?? '']);
    };
    xhr.onerror = evt => rej(evt);
    xhr.onabort = evt => console.log(evt);
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;
        onProgress(Math.round(percentage));
      }
    };

    const formData = toFormData(data, file);

    xhr.send(formData);
  });
}
