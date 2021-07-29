export default [
  {
    "method": "GET",
    "path": "/v1/customers",
    "meta": {
      "status": 200,
      "statusText": "OK",
      "id": "req_5mtw5jOjrTCgEO",
      "time": "01/06/2021, 13:17:13",
      "ipAddress": "159.65.91.153",
      "apiVersion": "2020-03-02",
      "application": "ProfitWell",
      "source": "Stripe/v1 PythonBindings/2.35.0"
    },
    "query": {
      "limit": "100",
      "created": {
        "gte": "1622073600",
        "lte": "1622501753"
      }
    },
  },
  {
    "method": "POST",
    "path": "/v1/customers",
    "meta": {
      "status": 200,
      "statusText": "OK",
      "id": "req_5mtw5jOjrTCgEP",
      "time": "01/06/2021, 13:17:13",
      "ipAddress": "159.65.91.153",
      "apiVersion": "2020-03-02",
      "source": "python-requests/2.24.0",
      "Idempotency": "Key – 1ea66393-3c55-42cd-ad70-393dc732f25c"
    },
    "response": {
      "id": "cus_JaKo6dxttvAHs4",
      "object": "customer",
      "address": null,
      "balance": 0,
      "created": 1622463740,
      "currency": null,
      "default_source": null,
      "delinquent": false,
      "description": null,
      "discount": null,
      "email": "infrastructure@sendsprint.com",
      "invoice_prefix": "740DAA76",
      "invoice_settings": {
        "custom_fields": null,
        "default_payment_method": null,
        "footer": null
      },
      "livemode": true,
      "metadata": {
      },
      "name": "Sprint Infrastructure",
      "next_invoice_sequence": 1,
      "phone": null,
      "preferred_locales": [
      ],
      "shipping": null,
      "sources": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/sources"
      },
      "subscriptions": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/subscriptions"
      },
      "tax_exempt": "none",
      "tax_ids": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/tax_ids"
      }
  },
    "query": {
      "email": "infrastructure@sendsprint.com",
      "name": "Sprint Infrastructure"
    }
  },
  {
    "method": "GET",
    "path": "/v1/customers",
    "meta": {
      "status": 200,
      "statusText": "OK",
      "id": "req_5mtw5jOjrTCgEY",
      "time": "01/06/2021, 13:17:13",
      "ipAddress": "159.65.91.153",
      "apiVersion": "2020-03-02",
      "application": "ProfitWell",
      "source": "Stripe/v1 PythonBindings/2.35.0"
    },
    "query": {
      "limit": "100",
      "created": {
        "gte": "1622073600",
        "lte": "1622501753"
      }
    },
  },
  {
    "method": "POST",
    "path": "/v1/customers",
    "meta": {
      "status": 403,
      "statusText": "ERR",
      "id": "req_Wu0xPzZTEMr8R",
      "time": "01/06/2021, 13:17:13",
      "ipAddress": "159.65.91.153",
      "apiVersion": "2020-03-02",
      "application": "ProfitWell",
      "source": "Stripe/v1 PythonBindings/2.35.0"
    },
    "response": {
      "error": {
        "message": "The provided key 'sk_live_*********************************************************************************************FZZNln' does not have the required permissions for this endpoint on account 'acct_1FrsweLyn8yE8I3W'. Having more permissions would allow this request to continue.",
        "type": "invalid_request_error"
      }
    }
  },
  {
    "method": "POST",
    "path": "/v1/customers",
    "meta": {
      "status": 200,
      "statusText": "OK",
      "id": "req_5mtw5jOjrTCgEQ",
      "time": "01/06/2021, 13:17:13",
      "ipAddress": "159.65.91.153",
      "apiVersion": "2020-03-02",
      "source": "python-requests/2.24.0",
      "Idempotency": "Key – 1ea66393-3c55-42cd-ad70-393dc732f25c"
    },
    "response": {
      "id": "cus_JaKo6dxttvAHs4",
      "object": "customer",
      "address": null,
      "balance": 0,
      "created": 1622463740,
      "currency": null,
      "default_source": null,
      "delinquent": false,
      "description": null,
      "discount": null,
      "email": "infrastructure@sendsprint.com",
      "invoice_prefix": "740DAA76",
      "invoice_settings": {
        "custom_fields": null,
        "default_payment_method": null,
        "footer": null
      },
      "livemode": true,
      "metadata": {
      },
      "name": "Sprint Infrastructure",
      "next_invoice_sequence": 1,
      "phone": null,
      "preferred_locales": [
      ],
      "shipping": null,
      "sources": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/sources"
      },
      "subscriptions": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/subscriptions"
      },
      "tax_exempt": "none",
      "tax_ids": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/tax_ids"
      }
  },
    "query": {
      "email": "infrastructure@sendsprint.com",
      "name": "Sprint Infrastructure"
    }
  },
  {
    "method": "GET",
    "path": "/v1/customers",
    "meta": {
      "status": 200,
      "statusText": "OK",
      "id": "req_5mtw5jOjrTCgE1",
      "time": "01/06/2021, 13:17:13",
      "ipAddress": "159.65.91.153",
      "apiVersion": "2020-03-02",
      "application": "ProfitWell",
      "source": "Stripe/v1 PythonBindings/2.35.0"
    },
    "query": {
      "limit": "100",
      "created": {
        "gte": "1622073600",
        "lte": "1622501753"
      }
    },
  },
  {
    "method": "GET",
    "path": "/v1/customers",
    "meta": {
      "status": 200,
      "statusText": "OK",
      "id": "req_5mtw5jOjrTCgE2",
      "time": "01/06/2021, 13:17:13",
      "ipAddress": "159.65.91.153",
      "apiVersion": "2020-03-02",
      "application": "ProfitWell",
      "source": "Stripe/v1 PythonBindings/2.35.0"
    },
    "query": {
      "limit": "100",
      "created": {
        "gte": "1622073600",
        "lte": "1622501753"
      }
    },
  },
  {
    "method": "POST",
    "path": "/v1/customers",
    "meta": {
      "status": 200,
      "statusText": "OK",
      "id": "req_5mtw5jOjrTCgER",
      "time": "01/06/2021, 13:17:13",
      "ipAddress": "159.65.91.153",
      "apiVersion": "2020-03-02",
      "source": "python-requests/2.24.0",
      "Idempotency": "Key – 1ea66393-3c55-42cd-ad70-393dc732f25c"
    },
    "response": {
      "id": "cus_JaKo6dxttvAHs4",
      "object": "customer",
      "address": null,
      "balance": 0,
      "created": 1622463740,
      "currency": null,
      "default_source": null,
      "delinquent": false,
      "description": null,
      "discount": null,
      "email": "infrastructure@sendsprint.com",
      "invoice_prefix": "740DAA76",
      "invoice_settings": {
        "custom_fields": null,
        "default_payment_method": null,
        "footer": null
      },
      "livemode": true,
      "metadata": {
      },
      "name": "Sprint Infrastructure",
      "next_invoice_sequence": 1,
      "phone": null,
      "preferred_locales": [
      ],
      "shipping": null,
      "sources": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/sources"
      },
      "subscriptions": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/subscriptions"
      },
      "tax_exempt": "none",
      "tax_ids": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/tax_ids"
      }
  },
    "query": {
      "email": "infrastructure@sendsprint.com",
      "name": "Sprint Infrastructure"
    }
  },
  {
    "method": "POST",
    "path": "/v1/customers",
    "meta": {
      "status": 200,
      "statusText": "OK",
      "id": "req_5mtw5jOjrTCgE",
      "time": "01/06/2021, 13:17:13",
      "ipAddress": "159.65.91.153",
      "apiVersion": "2020-03-02",
      "source": "python-requests/2.24.0",
      "Idempotency": "Key – 1ea66393-3c55-42cd-ad70-393dc732f25c"
    },
    "response": {
      "id": "cus_JaKo6dxttvAHs4",
      "object": "customer",
      "address": null,
      "balance": 0,
      "created": 1622463740,
      "currency": null,
      "default_source": null,
      "delinquent": false,
      "description": null,
      "discount": null,
      "email": "infrastructure@sendsprint.com",
      "invoice_prefix": "740DAA76",
      "invoice_settings": {
        "custom_fields": null,
        "default_payment_method": null,
        "footer": null
      },
      "livemode": true,
      "metadata": {
      },
      "name": "Sprint Infrastructure",
      "next_invoice_sequence": 1,
      "phone": null,
      "preferred_locales": [
      ],
      "shipping": null,
      "sources": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/sources"
      },
      "subscriptions": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/subscriptions"
      },
      "tax_exempt": "none",
      "tax_ids": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/tax_ids"
      }
  },
    "query": {
      "email": "infrastructure@sendsprint.com",
      "name": "Sprint Infrastructure"
    }
  },
  {
    "method": "POST",
    "path": "/v1/customers",
    "meta": {
      "status": 403,
      "statusText": "ERR",
      "id": "req_Wu0xPzZTEMr8S",
      "time": "01/06/2021, 13:17:13",
      "ipAddress": "159.65.91.153",
      "apiVersion": "2020-03-02",
      "application": "ProfitWell",
      "source": "Stripe/v1 PythonBindings/2.35.0"
    },
    "response": {
      "error": {
        "message": "The provided key 'sk_live_*********************************************************************************************FZZNln' does not have the required permissions for this endpoint on account 'acct_1FrsweLyn8yE8I3W'. Having more permissions would allow this request to continue.",
        "type": "invalid_request_error"
      }
    }
  },
  {
    "method": "POST",
    "path": "/v1/customers",
    "meta": {
      "status": 200,
      "statusText": "OK",
      "id": "req_5mtw5jOjrTCgF",
      "time": "01/06/2021, 13:17:13",
      "ipAddress": "159.65.91.153",
      "apiVersion": "2020-03-02",
      "source": "python-requests/2.24.0",
      "Idempotency": "Key – 1ea66393-3c55-42cd-ad70-393dc732f25c"
    },
    "response": {
      "id": "cus_JaKo6dxttvAHs4",
      "object": "customer",
      "address": null,
      "balance": 0,
      "created": 1622463740,
      "currency": null,
      "default_source": null,
      "delinquent": false,
      "description": null,
      "discount": null,
      "email": "infrastructure@sendsprint.com",
      "invoice_prefix": "740DAA76",
      "invoice_settings": {
        "custom_fields": null,
        "default_payment_method": null,
        "footer": null
      },
      "livemode": true,
      "metadata": {
      },
      "name": "Sprint Infrastructure",
      "next_invoice_sequence": 1,
      "phone": null,
      "preferred_locales": [
      ],
      "shipping": null,
      "sources": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/sources"
      },
      "subscriptions": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/subscriptions"
      },
      "tax_exempt": "none",
      "tax_ids": {
        "object": "list",
        "data": [
        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/customers/cus_JaKo6dxttvAHs4/tax_ids"
      }
    },
    "query": {
      "email": "infrastructure@sendsprint.com",
      "name": "Sprint Infrastructure"
    }
  }
]