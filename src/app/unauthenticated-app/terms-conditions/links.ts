import {
  AcceptableUsePolicy,
  PrivacyPolicy,
  RefundPolicy,
  StandardTermsOfUse,
  TermsOfService
} from './pages'

export default {
  'terms-of-use': {
    name: 'Standard Terms of Use',
    key: 'terms-of-use',
    page: StandardTermsOfUse,
    last_updated: '12th June, 2020',
    sections: [
      {
        name: 'Accounts',
        key: 'accounts'
      },
      {
        name: 'Payment',
        key: 'payment'
      },
      {
        name: 'Rights',
        key: 'rights'
      },
      {
        name: 'Rules and Abuse',
        key: 'rules-abuse'
      },
      {
        name: 'Liability',
        key: 'liability'
      },
      {
        name: 'Other Important Stuff',
        key: 'other'
      }
    ]
  },
  'refund-policy': {
    name: 'Refund Policy',
    key: 'refund-policy',
    page: RefundPolicy,
    last_updated: '12th June, 2020',
    sections: []
  },
  'acceptable-use': {
    name: 'Acceptable Use Policy',
    key: 'acceptable-use',
    page: AcceptableUsePolicy,
    last_updated: '12th June, 2020',
    sections: [
      {
        name: 'Prohibited Content',
        key: 'prohibited-content'
      },
      {
        name: 'Content Subject to Additional Scrutiny',
        key: 'content-subject-to-additional-scrutiny'
      },
      {
        name: 'Prohibited Actions',
        key: 'prohibited-actions'
      },
      {
        name: 'Best Practices',
        key: 'best-practices'
      }
    ]
  },
  'terms-of-service': {
    name: 'Terms of Service',
    key: 'terms-of-service',
    page: TermsOfService,
    last_updated: '12th June, 2020',
    sections: [
      {
        name: 'Account Terms',
        key: 'account-terms'
      },
      {
        name: 'Payment, Refunds, and Plan Changes',
        key: 'payments-refunds'
      },
      {
        name: 'Cancellation and Termination',
        key: 'cancellation-termination'
      },
      {
        name: 'Modifications to the Service and Prices',
        key: 'modifications'
      },
      {
        name: 'Uptime, Security, and Privacy',
        key: 'uptime-security-privacy'
      },
      {
        name: 'Copyright and Content Ownership',
        key: 'copyright'
      },
      {
        name: 'Features and Bugs',
        key: 'features-bugs'
      },
      {
        name: 'Services Adaptations and API Terms',
        key: 'services-adaptations-api'
      },
      {
        name: 'Liability',
        key: 'liability'
      }
    ]
  },
  'privacy-policy': {
    name: 'Privacy Policy',
    key: 'privacy-policy',
    page: PrivacyPolicy,
    last_updated: '12th June, 2020',
    sections: [
      {
        name: 'What we collect and why',
        key: 'what-we-collect'
      },
      {
        name: "What we don't collect",
        key: 'what-we-dont-collect'
      },
      {
        name: 'When we access or share your information',
        key: 'when-we-access'
      },
      {
        name: 'Location of Site and Data',
        key: 'site-data-location'
      },
      {
        name: 'Your Rights With Respect to Your Information',
        key: 'rights'
      },
      {
        name: 'How we secure your data',
        key: 'security'
      },
      {
        name: 'Data deletion',
        key: 'data-deletion'
      },
      {
        name: 'EU-US and Swiss-US',
        key: 'privacy-shield'
      },
      {
        name: 'Changes & questions',
        key: 'changes'
      }
    ]
  }
}
